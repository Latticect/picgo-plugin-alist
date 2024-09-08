import type { PostOptions, RefreshOptions, UserConfig } from './types'
export const getRefreshOptions = (options: RefreshOptions) => {
  const { url, token, uploadPath } = options
  const v3options = {
    method: 'POST',
    url: `${url}/api/fs/list`,
    rejectUnauthorized: false,
    // contentType: 'application/json',
    headers: {
      'User-Agent': 'PicGo',
      'Authorization': token,
    },
    body: {
      page: 1,
      password: "",
      path: `/${uploadPath}`,
      per_page: 0,
      refresh: true,
    },
    json: true,
  }
  return v3options
}

export const getPostOptions = (options: PostOptions) => {
  const { url, files, token, uploadPath, fileName } = options
  const date = new Date()
  const v3options = {
    method: 'PUT',
    url: `${url}/api/fs/form`,
    rejectUnauthorized: false,
    headers: {
      // "Content-Type": 'multipart/form-data',
      'User-Agent': 'PicGo',
      'Authorization': token,
      'file-path': encodeURIComponent(`/${uploadPath}/${fileName}`),
    },
    formData: {
      file: {
        value: files,
        options: {
          filename: fileName,
        },
      },
    },
    json: true,
  }
  return v3options
}


export const getToken = (options: UserConfig) => {
  const { url, username, password } = options
  const v3options = {
    method: 'POST',
    url: `${url}/api/auth/login`,
    headers: {
      'User-Agent': 'PicGo',
    },
    body: {
      username,
      password
    },
    json: true,
  }
  return v3options

}
