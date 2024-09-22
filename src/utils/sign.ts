import CryptoJS from 'crypto-js/crypto-js'
export const getSign = (path: string, signToken: string, signExpired: number) => {
  const data = "/" + path + ":" + signExpired
  const sha = CryptoJS.HmacSHA256(data, signToken)
  return `${CryptoJS.enc.Base64url.stringify(sha)}=:${signExpired}`
}

