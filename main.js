const { app, BrowserWindow, Tray, Menu, ipcRenderer } = require('electron');
const path = require('path');
const iconPath = path.join(__dirname, './src/img/run.ico');
let mainWindow = null;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800, // 设置窗口宽度
    height: 600, // 设置窗口高度
    resizable: false, // 不允许用户改变窗口大小
    icon: iconPath, // 应用运行时的标题栏图标
    frame: false, //无边框窗口
    webPreferences: {
      backgroundThrottling: false, // 设置应用在后台正常运行
      nodeIntegration: true, // 设置能在页面使用nodejs的API
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('./src/index.html');
  // mainWindow.loadFile(`file://${__dirname}/src/index.html`); //报错
  mainWindow.removeMenu();
}
function createTray () {
  const tray = new Tray(iconPath); // 实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url
  tray.setToolTip('我的应用'); // 鼠标移到托盘中应用程序的图标上时，显示的文本
  tray.on('click', () => { // 点击图标的响应事件， 这里是切换主窗口的显示和隐藏
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  })
  tray.on('right-click', () => { // 右键点击图标时，出现的菜单，通过Menu.buildFromTemplate定制，这里只包含退出程序的选项。
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ])
    tray.popUpContextMenu(menuConfig);
  })
}
app.whenReady().then(() => {
  createWindow();
  createTray();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})