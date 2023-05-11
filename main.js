const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const app2 = require('electron').app;
const log = require("electron-log");
const { version } = require("./package");

console.log(`Current version: ${version}`);

autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'electron-autoupdate',
  owner: 'Minal-codezee',
  private: true,
  token: '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'
});

Object.defineProperty(app2, 'isPackaged', {
  get() {
    return true;
  }
});

let win;

createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      defaultEncoding: 'UTF-8'
    },
  })

  win.loadFile('index.html');

  // win.webContents.openDevTools();
  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//Hide menubar
// app.on('browser-window-created', function (e, window) {
//   window.setMenu(null);
// });

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

// autoUpdater.on("checkForUpdates ", function (_arg1) {
//   console.log('checkForUpdates', _arg1);
//     // return log.info("Checking for update...");
// });

autoUpdater.on("checking-for-update", (_arg1) => {
  dialog.showMessageBox({
    message: 'CHECKING FOR UPDATES !!',
    _arg1
  })
  return log.info("Checking for update...");
});

autoUpdater.on('update-available', () => {
  log.info("update-available");
  dialog.showMessageBox({
    message: 'update-available !!'
  })
  win.webContents.send('update_available');
});

autoUpdater.on("update-not-available", () => {
  log.info("auto updater sending update NOT available");
  dialog.showMessageBox({
    message: 'auto updater sending update NOT available !!'
  })
  win.webContents.send("update_not_available");
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, updateURL) => {
  log.info('update-downloaded');
  console.log("update-downloaded", {
    event,
    releaseNotes,
    releaseName,
    updateURL,
  });
  dialog.showMessageBox({
    message: 'update Downloaded !!'
  })
  win.webContents.send('update_downloaded');
});

autoUpdater.on("error", function (err) {
  console.log('err', err);
  return log.info("Error in auto-updater. " + err);
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})