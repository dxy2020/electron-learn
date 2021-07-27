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

运行：package.json配置文件中的scripts字段下增加一条start命令：

```json
{
  "scripts": {
    "start": "electron ."
  }
}
```

```powershell
npm start
```



```powershell
npm install --save-dev electron
# 或 cnpm install --save-dev electron
```

打包：将 Electron Forge 添加到您应用的开发依赖中，并使用其"import"命令设置 Forge 的脚手架。

```powershell
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

安装`npm install --save-dev @electron-forge/cli` 后 package.json scripts：

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make"
  }
```

使用 Forge 的 `make` 命令来创建可分发的应用程序：

```
npm run make
```

快捷键：

* ctrl+shift+i   打开开发者工具