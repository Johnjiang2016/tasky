const { ipcRenderer } = require('electron');

const domClose = document.querySelector('.close');

domClose.addEventListener('click', () => {
    ipcRenderer.send('mainWin:close',{msg:'我是自定义消息！'})
})

