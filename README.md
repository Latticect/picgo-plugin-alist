## picgo-plugin-alist

plugin for picgo

通过alist实现对oneDrive、阿里云盘、天翼云盘、GoogleDrive、夸克网盘、迅雷云盘等的文件上传，并通过alist实现直链获取（alist可以处理动态直链问题），最终达成对上述各网盘的图床实现。

只支持alist `v3`版本。

## alist简介

[alist](https://github.com/alist-org/alist)是一个支持多存储的文件列表程序，使用 `Gin` 和 `Solidjs`。使用alist可以利用OneDrive等网盘快速搭建一个下载站。
![](/readme/alist.png)



## 参数

| key              | 是否必填 | description                                                  | example                   |
| ---------------- | -------- | ------------------------------------------------------------ | ------------------------- |
| alist地址        | √        | 你的alist地址                                                | https://alist.example.com |
| 上传路径         | √        | 上传的相对路径（alist内的路径，根据路径上传到对应网盘）      | assets                    |
| 账号             | √        | alist的后台登录账号                                          | admin                     |
| 密码             | √        | alist的后台登录密码                                          | admin                     |
| 过期时间         | √        | token的过期时间，单位：小时，默认是48小时                    | 48                        |
| 访问路径         | ×        | 公开的访问路径（资源最终链接，默认同上传路径）               | public                    |
| 文件夹按日期分类 | √        | 勾选后，上传路径会按年月日分类，如https://alist.example.com/2024/9/8/202409081225753.png | yes                       |
| 令牌             | ×        | 填入 alist管理页面-设置-其他-令牌                            | alist-XXXXXXXXXXX...      |
| 签名过期时间     | ×        | 默认值为0没，推荐使用默认值，在alist管理页面-全局-直链有限期，查看和设置 | 0                         |


## 说明
### 文件签名

当有令牌时，插件会自动进行签名，令牌的获取位置如下图

![sign_expired](/readme/sign_expired.png)

sign过期时间是alist直链过期时间，位置如下图

![sign_expired](/readme/sign_token.png)

## 安装

- 在线安装
    打开 [PicGo](https://github.com/Molunerfinn/PicGo) 详细窗口，选择`插件设置`，搜索`alist`安装。

- 离线安装
  克隆该项目，复制项目到 以下目录：
  - Windows: `%APPDATA%\picgo\`
  - Linux: `$XDG_CONFIG_HOME/picgo/` or `~/.config/picgo/`
  - macOS: `~/Library/Application\ Support/picgo/`

  切换到新目录执行 `npm install ./picgo-plugin-alist`，然后重启应用即可。
