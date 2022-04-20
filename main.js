const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')

// 创建窗口类
class AppWindow extends BrowserWindow{
  constructor(config, fileLocation){
    const basicConfig = {
      width: 800,
      height: 600,
      // 渲染进程-可以写js、nodejs等
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    }

    const finalConfig = {...basicConfig, ...config}
    super(finalConfig)
    this.loadFile(fileLocation)

    // 在加载页面时，渲染进程第一次完成绘制时，如果窗口还没有被显示，渲染进程会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁：
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

const createWindow = () => {
  // const mainWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   // 渲染进程-可以写js、nodejs等
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js')
  //   }
  // })

  // // and load the index.html of the app.
  // mainWindow.loadFile('./renderer/index.html')
  const mainWindow = new AppWindow({},'./renderer/index.html')

  ipcMain.on('add-music-window', () => {
    console.log('hello from index page');

    const addWindow = new AppWindow({
      width: 400,
      height: 300,
      parent: mainWindow
    }, './renderer/add.html')

    // 选择本地文件
    ipcMain.on('select-music', () => {
      console.log('select-music');

      dialog.showOpenDialog({
        title: 'title',
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Music', extensions: ['mp3'] }
        ]
      }).then(res => {
        console.log(res.canceled);
        console.log(res.filePaths);
      }).catch(err => {
        console.log(err);
      })

    })

    // Open the DevTools.
    addWindow.webContents.openDevTools()
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 用于保存后端自动刷新
try {
  require('electron-reloader')(module,{});
} catch (_) {}
