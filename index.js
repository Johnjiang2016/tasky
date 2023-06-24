const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require('electron');

let mainWin = null,
  tray = null,
  remindWin = null;

app.on('ready', () => {

  mainWin = new BrowserWindow({
    // 无边框：隐藏菜单栏和工具栏
    frame: false,
    resizable: false,
    width: 800,
    height: 600,
    webPreferences: {
      // 置应用在后台正常运行
      backgroundThrottling: false,
      // 设置能在页面使用nodejs Api
      nodeIntegration: true,
      // 否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本.
      contextIsolation: false
    }
  });

  // 移除菜单
  mainWin.removeMenu();

  mainWin.loadFile('./src/main.html');

  // 实例化一个托盘对象，构造函数参数是一个小图标
  tray = new Tray('./src/img/icon.png')

  // 鼠标移过去，显示一个文本提示
  tray.setToolTip('To Do');

  // 点击托盘显示隐藏窗口
  tray.on('click', () => {
    // console.log('tray click!',{isVisible:mainWin.isVisible})

    if (mainWin.isVisible()) {
      mainWin.hide()
    } else {
      mainWin.show()
    }
  });

  // 右键托盘，添加退出上下文菜单
  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]);
    tray.popUpContextMenu(menuConfig);
  });

  // 隐藏窗口
  ipcMain.on('mainWin:close', (evt, data) => {
    mainWin.hide()
  });

  ipcMain.on('remindWindow:close', () => {
    remindWin.hide()
  });

  // const point = screen.getCursorScreenPoint();

  // console.log({ point })




  // setTimeout(() => {
  //   mainWin.hide()
  //   createRemindWindow('test,')
  // }, 3000)

});


function createRemindWindow(task) {

  remindWin = new BrowserWindow({
    width: 300,
    // frame: false,
    height: 300,
    webPreferences: {
      // 设置能在页面使用nodejs Api
      nodeIntegration: true,
      // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本.
      contextIsolation: false
    }
  });

  // 获取主屏幕尺寸信息
  const size = screen.getPrimaryDisplay().workAreaSize;
  // 获取托盘边界
  const { y } = tray.getBounds();
  const { width, height } = remindWin.getBounds();
  // 如果是 Mac os 
  const yPos = process.platform === 'darwin' ? y : y - height;

  remindWin.setBounds({
    width,
    height,
    x: size.width - width,
    y: yPos
  })

  // 当有多个窗口时候，让提醒窗口，处于最上方
  remindWin.setAlwaysOnTop(true)

  remindWin.loadFile('./src/remind.html');

  remindWin.webContents.send('setTask', task);

  // setTimeout(() => {
  //   remindWin.close()
  // }, 4000)

  remindWin.on('closed', () => {
    console.log('remind Win closed');
    remindWin = null;
  });

  

}