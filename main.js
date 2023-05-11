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

  // Open devTools 
  // win.webContents.openDevTools();

  // Open devTools in seperate window 
  let wc = win.webContents;
  wc.openDevTools({ mode: "undocked" });
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdates();
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

autoUpdater.on("checking-for-update", (_arg1) => {
  dialog.showMessageBox({
    message: 'CHECKING FOR UPDATES !!',
    _arg1
  });
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    message: 'update-available !!'
  });
  autoUpdater.downloadUpdate();
  // curWindow.showMessage(pth);
  // win.webContents.send('update_available');
});

autoUpdater.on("update-not-available", () => {
  dialog.showMessageBox({
    message: 'auto updater sending update NOT available !!'
  });
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, updateURL) => {
  console.log("update-downloaded", {
    event,
    releaseNotes,
    releaseName,
    updateURL,
  });
  dialog.showMessageBox({
    message: 'update Downloaded !!' + releaseNotes + releaseName + updateURL
  });
  // win.webContents.send('update_downloaded');
});

autoUpdater.on("error", function (err) {
  dialog.showMessageBox({
    message: "Error in auto-updater. " + err
  });
});