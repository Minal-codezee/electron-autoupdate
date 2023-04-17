const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'release-builds');
  console.log(outPath);

  return Promise.resolve({
    appDirectory: path.join(outPath, 'my-electron-app-win32-x64'),
    authors: 'Minal',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'my-electron-app.exe',
    setupExe: 'my-electron-app.exe'
  });
}


//Electron builder
// const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
// const path = require('path');

// getInstallerConfig()
//   .then(createWindowsInstaller)
//   .catch((error) => {
//     console.error(error.message || error)
//     process.exit(1)
//   })

// function getInstallerConfig () {
//   console.log('creating windows installer')
//   const rootPath = path.join('./');
//   const outPath = path.join(rootPath, 'dist');
//   console.log(outPath);

//   return Promise.resolve({
//     appDirectory: path.join(outPath, 'win-unpacked'),
//     authors: 'Minal',
//     noMsi: false,
//     outputDirectory: path.join(outPath, 'windows-installer'),
//     exe: 'my-electron-app Setup 1.0.0.exe',
//     setupExe: 'ElectronTutorialAppInstaller.exe'
//   });
// }