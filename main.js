const { app, BrowserWindow, Tray, Menu, ipcRenderer, ipcMain, Notification, screen, autoUpdater, dialog } = require('electron');
const path = require('path');
const iconPath = path.join(__dirname, 'src/img/run.ico');
let mainWindow = null, remindWindow = null, tray = null;
// let propressInterval = null;
const NOTIFICATION_TITLE = 'Basic Notification';
const NOTIFICATION_BODY = 'Notification from the Main process';
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
      // preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.loadFile('./src/index.html');
  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
  // mainWindow.loadURL(`file://${__dirname}/src/index.html`); //报错
  mainWindow.removeMenu();
  // const INCREMENT = 0.03;
  // const INTERVAL_DELAY = 100;
  // let c = 0;
  // propressInterval = setInterval(() => {
  //   mainWindow.setProgressBar(c);
  //   if (c < 2) c += INCREMENT;
  //   else c = 0;
  // }, INTERVAL_DELAY);
}
function createTray () {
  tray = new Tray(iconPath); // 实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url
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
      },{
        label: 'More'
      }
    ])
    tray.popUpContextMenu(menuConfig);
  })
}

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show();
}

function createIpcMain () {
  ipcMain.on('mainWindow:close', () => {
    mainWindow.hide();
    createRemindWindow('http%3A%2F%2Fwww.w3school.com.cn%2FMy%20first%2F');
  })
  ipcMain.on('remindWindow:close', () => {
    remindWindow.close();
  })
  ipcMain.on('setTaskTimer', (event, time, task) => {
    const now = new Date();
    const date = new Date();
    date.setHours(time.slice(0, 2), time.slice(3), 0);
    const timeout = date.getTime() - now.getTime();
    setTimeout(() => {
      createRemindWindow(task);
    }, timeout)
  })
}

function createRemindWindow (task) {
  if (remindWindow) remindWindow.close();
  remindWindow = new BrowserWindow({
    height: 120,
    width: 360,
    frame: false,
    resizable: false,
    // icon: iconPath,
    show: false,
    webPreferences: {
      nodeIntegration: true, // 设置能在页面使用nodejs的API
      contextIsolation: false,
      // preload: path.join(__dirname, 'remind.js')
    }
  })
  remindWindow.removeMenu();
  // 获取屏幕尺寸
  const size = screen.getPrimaryDisplay().workAreaSize;
  // 获取托盘位置的y坐标(windows在右下角，Mac在右上角)
  const { y } = tray.getBounds();
  // 获取窗口的宽高
  const { height, width } = remindWindow.getBounds();
  // 计算窗口的 y 坐标
  const yPosition = process.platform === 'darwin' ? y : y - height;
  // setBounds 设置窗口的位置
  remindWindow.setBounds({
    x: size.width - width, // x坐标为屏幕宽度 - 窗口宽度
    y: yPosition,
    height,
    width
  })
  // 当有多个应用时，提醒窗口始终处于最上层
  remindWindow.setAlwaysOnTop(true);
  // remindWindow.loadFile('./src/remind.html');
  remindWindow.loadFile(path.join(__dirname, 'src/remind.html'));
  // remindWindow.loadURL(`file://${__dirname}/src/remind.html`);
  // 主进程发送消息给渲染进程
  remindWindow.show();
  remindWindow.webContents.send('setTask', task);
  remindWindow.on('closed', () => { remindWindow = null });
  setTimeout(() => {
    remindWindow && remindWindow.close();   
  }, 10000);
}

app.whenReady().then(() => {
  // 检查更新
  // checkUpdate();
  createWindow();
  createTray();
  createIpcMain();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
}).then(showNotification);

app.on('before-quit', () => {
  // clearInterval(propressInterval);
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})

function checkUpdate () {
  if (process.platform === 'darwin') autoUpdater.setFeedURL('http://www.electronjs.org');
  else autoUpdater.setFeedURL('http://www.electronjs.org');
  autoUpdater.checkForUpdates();
  autoUpdater.on('error', (err) => {
    console.log(err);
  })
  autoUpdater.on('update-available', () => {
    console.log('found new version');
  })
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本,是否更新?',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if (buttonIndex.response === 0) {
        autoUpdater.quitAndInstall();
        app.quit();
      }
    })
  })
}