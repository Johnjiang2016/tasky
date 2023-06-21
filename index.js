const { app, BrowserWindow } = require('electron');

app.on('ready', () => {

    const mainWin = new BrowserWindow();

    mainWin.loadFile('./src/main.html');

    console.log('just test console!')


})