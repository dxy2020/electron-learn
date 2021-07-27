## 环境搭建

```powershell
npm init # 或 npm init -y
```

`init`初始化命令会提示您在项目初始化配置中设置一些值 为本教程的目的，有几条规则需要遵循：

- `entry point` 应为 `main.js`.
- `author` 与 `description` 可为任意值，但对于应用打包是必填项。

 例子

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "Jane Doe",
  "license": "MIT"
}
```

```powershell
npm install --save-dev electron
# 或 cnpm install --save-dev electron
```

打包

```powershell
npm install --save-dev @electron-forge/cli
npx electron-forge import
```





```shell
Host github.com
	HostName github.com
	IdentityFile ~/.ssh/github_id_rsa
	PreferredAuthentications publickey
```



