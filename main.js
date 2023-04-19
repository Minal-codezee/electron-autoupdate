const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  })

  win.loadFile('index.html');

  win.webContents.openDevTools();

  
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//Hide menubar
app.on('browser-window-created',function(e,window) {
  window.setMenu(null);
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.logger.transports.file.level = "info";
autoUpdater.on("checking-for-update", function (_arg1) {
    return log.info("Checking for update...");
});

autoUpdater.on('update-available', () => {
  console.log('update-available');
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  console.log('update-downloaded');
  mainWindow.webContents.send('update_downloaded');
});
autoUpdater.on("error", function (err) {
  console.log('err', err);
  return log.info("Error in auto-updater. " + err);
});