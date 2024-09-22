import type { Stream } from 'stream'
export interface UserConfig {
  url: string
  username: string
  password: string
  uploadPath: string
  accessPath: string
  token: string
  signToken: string
  signExpired: number
  expireTime:number
  expired:number
  folderClass:boolean
}

export interface PostOptions {
  url: string
  uploadPath: string
  token: string
  files: Stream
  fileName?: string
}

export interface RefreshOptions {
  url: string
  token: string
  uploadPath: string
}

export interface Files {
  value: Stream
  options: {
    fileName: string
  }
}
