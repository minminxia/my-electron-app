const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
// const Store = require('electron-store');
const dataStore = require('./renderer/MusicDataStore');
const myStore = new dataStore({'name':'Music Data'})

// =================electron-store的试用 
// const store = new Store();
// console.log(app.getPath('userData'));
// cd /Users/liuminxia/Library/Application\ Support/my-first-electron-app
// ls
// cat config.js即可看到数据，因为new Store()没有命名，默认就是config.js

// store.set('unicorn', '🦄');
// console.log(store.get('unicorn'));
// //=> '🦄'

// // Use dot-notation to access nested properties
// store.set('foo.bar', true);
// console.log(store.get('foo'));
// //=> {bar: true}

// store.delete('unicorn');
// console.log(store.get('unicorn'));
// //=> undefined
// =================electron-store的试用 

async function handleFileOpen() {
  const dialogConfig = {
    title: 'title',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Music', extensions: ['mp3'] }]
  }
  const { canceled, filePaths } = await dialog.showOpenDialog(dialogConfig)
  if (canceled) {
    return
  } else {
    return filePaths
  }
}

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
      width: 800,
      height: 300,
      parent: mainWindow
    }, './renderer/add.html')

    // 选择本地文件
    // 新版写法：通过处理preload的ipcRenderer.invoke获取文件
    ipcMain.handle('dialog:openFile', handleFileOpen)
    // 老写法，通过监听preload的ipcRenderer.send来选取本地文件
    // ipcMain.on('select-music', (event) => {
    //   console.log('select-music');
    //   dialog.showOpenDialog({
    //     title: 'title',
    //     properties: ['openFile', 'multiSelections'],
    //     filters: [
    //       { name: 'Music', extensions: ['mp3'] }
    //     ]
    //   }).then(res => {
    //     console.log(res.canceled);
    //     console.log(res.filePaths);
    //     const files = res.filePaths
    //     // 将主进程拿到的文件路径发给添加页面（渲染进程）
    //     event.sender.send('select-files', files)
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // })

    // 导入音乐
    ipcMain.on('add-music',(event, musicFilePaths)=>{
      console.log('监听到addMusic消息', musicFilePaths);
      // 把消息发给index,js渲染进程（两个渲染进程如何通讯？）
      const updateTracks = myStore.addTracks(musicFilePaths).getTracks()
      console.log(updateTracks);
    })
  })

  // Open the DevTools.也可以直接通过浏览器的快捷键o+c+i
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
// try {
//   require('electron-reloader')(module,{});
// } catch (_) {}
