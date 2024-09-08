import type { IPluginConfig, PicGo } from 'picgo'
import type { UserConfig } from './types'

export const uploaderName = 'alist'
export const bedName = `picBed.${uploaderName}`

export const getConfig = (ctx: PicGo): IPluginConfig[] => {
  let userConfig: UserConfig = ctx.getConfig(bedName)
  if (!userConfig) {
  // throw new Error("Can't find uploader config")
    userConfig = <any>{}
  }

  const config = [
    {
      name: 'url',
      type: 'input',
      default: userConfig.url ?? '',
      message: '你的alist地址，如https://alist.example.com。',
      required: true,
      alias: 'alist地址',
    },
    {
      name: 'uploadPath',
      type: 'input',
      default: userConfig.uploadPath ?? '',
      message: '上传的相对路径，如assets。',
      required: true,
      alias: '上传路径',
    },
    {
      name: 'username',
      type: 'input',
      default: userConfig.username ?? '',
      message: '请填写账号',
      required: true,
      alias: '账号',
    },
    {
      name: 'password',
      type: 'password',
      default: userConfig.password ?? '',
      message: '请填写密码',
      required: true,
      alias: '密码',
    },
    {
      name: 'expireTime',
      type: 'input',
      default: userConfig.expireTime ?? 48,
      message: '填写token过期时间，默认48小时，单位小时',
      required: true,
      alias: '过期时间',
    },
    {
      name: 'accessPath',
      type: 'input',
      default: userConfig.accessPath ?? '',
      message: '若留空，则访问路径与上传路径一致。',
      required: false,
      alias: '访问路径',
    },
    {
      name: 'folderClass',
      type: 'confirm',
      default: userConfig.folderClass || true,
      message: '上传图片按日期进行文件夹分类',
      required: true,
      alias: '文件夹按日期分类'
    },
  ]
  return config
}
