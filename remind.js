const { ipcRenderer } = require("electron")

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('setTask', (event, task) => {
    const msgEle = document.getElementById('message');
    msgEle.innerHTML = `<span>${decodeURIComponent(task)}</span>的时间到啦`;
  })
})