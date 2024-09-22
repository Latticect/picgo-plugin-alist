import nodePath from 'path'
import fs from 'fs'
import type { PicGo } from 'picgo'
import temporaryDirectory from 'temp-dir'
import { rmBothEndSlashes, rmEndSlashes } from './utils/index'
import { bedName } from './config'
import type { UserConfig } from './types'
import { getPostOptions, getRefreshOptions, getToken } from './option'
import { getSign } from './utils/index'

export const handle = async (ctx: PicGo): Promise<PicGo> => {
  const userConfig: UserConfig = ctx.getConfig(bedName)
  if (!userConfig)
    throw new Error("Can't find uploader config")
  let { url, uploadPath, accessPath, expireTime, expired, folderClass, signToken, signExpired } = userConfig
  const { token } = userConfig
  // 检查token是否过期
  const now = Date.now()
  if (!expired) expired = 0

  if (!token || now >= expired) {
    try {
      const PostOptions = getToken(userConfig)
      const res = await ctx.request(PostOptions)
      if (res.code !== Number(200)) {
        throw new Error(`[请求出错]${JSON.stringify(res)}`)
      }
      ctx.log.info(res)
      ctx.saveConfig({ 'picBed.alist.token': res.data.token })
      ctx.saveConfig({ 'picBed.alist.expired': Date.now() + expireTime * 60 * 60 * 100 })
      ctx.log.info(`刷新token:${res.data.token}}`)
    } catch (err) {
      throw new Error(`刷新token失败，${err.message}`)
    }
  }
  uploadPath = rmBothEndSlashes(uploadPath)
  if (!accessPath)
    accessPath = uploadPath
  else
    accessPath = rmBothEndSlashes(accessPath)
  if (folderClass) {
    const date = new Date()
    uploadPath += `/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  url = rmEndSlashes(url)
  const imgList = ctx.output
  for (const i in imgList) {
    try {
      const image = imgList[i].buffer
      const fileName = imgList[i].fileName
      const tempFilePath = nodePath.join(temporaryDirectory, fileName)
      ctx.log.info(`[信息]\{uploadPath:${uploadPath},fileName:${fileName}\}`)
      try {
        fs.writeFileSync(tempFilePath, image)
      }
      catch (err) {
        throw new Error(`[缓存文件失败]文件${tempFilePath},${err.message}`)
      }
      ctx.log.info(`[信息]已经写入文件${tempFilePath}`)
      const stream = fs.createReadStream(tempFilePath)
      if (!stream)
        throw new Error(`[读取缓存文件失败]文件${tempFilePath}`)
      const postOptions = getPostOptions({
        url,
        token,
        uploadPath,
        files: stream,
        fileName,
      })
      try {
        const res = await ctx.request(postOptions)
        ctx.log.info(`[请求结果]${JSON.stringify(res)}`)
        if (res.code !== Number(200))
          throw new Error(`[请求出错]${JSON.stringify(res)}`)

        const path = `${uploadPath}/${imgList[i].fileName}`
        if (signToken){
          // ctx.log.info(`[${path}],[${signToken}]`)
          const sign = getSign(path,signToken,signExpired)
          ctx.log.info(`[签名计算]签名计算结果：${sign}`)
          imgList[i].imgUrl = `${url}/d/${path}?sign=${sign}`
        }else{
          imgList[i].imgUrl = `${url}/d/${path}`
        }
      }
      catch (err) {
        throw new Error(`[上传操作]异常：${err.message}`)
      }
      finally {
        stream.close()
      }
      try {
        fs.unlinkSync(tempFilePath)
      }
      catch (err) {
        ctx.log.warn(`[删除缓存文件失败]文件${tempFilePath}，程序继续执行,ERROR:${err}`)
      }
      try {
        const refreshOptions = getRefreshOptions({
          url,
          uploadPath,
          token,
        })
        const res = await ctx.request(refreshOptions)
        ctx.log.info(`[刷新请求结果]\{code:${res.code},message:${res.message}\}`)
        if (res.code !== Number(200))
          throw new Error(`[刷新请求出错]${res}`)
      }
      catch (err) {
        throw new Error(`[刷新操作]异常：${err.message}`)
      }
      delete imgList[i].base64Image
      delete imgList[i].buffer
    }
    catch (error) {
      ctx.log.error(error)
      ctx.emit('notification', {
        title: '上传失败',
        body: error.message,
      })
    }
  }
  return ctx
}
