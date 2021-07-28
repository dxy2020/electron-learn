const { ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerHTML = text;
  }
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
  // 点击关闭事件
  const closeEle = document.getElementById('app-close');
  closeEle.addEventListener('click', () => {
    ipcRenderer.send('mainWindow:close');
  })
})

const NOTIFICATION_TITLE = 'Title';
const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.';
const CLICK_MESSAGE = 'NoTification clicked';
new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick = () => console.log(CLICK_MESSAGE);