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
      width: 1000,
      height: 800,
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
  mainWindow.webContents.on('did-finish-load', ()=>{
    console.log('page-did-finish-load');
    const updateTracks = myStore.getTracks()
    console.log('主进程拿到的electron-store的数据', updateTracks);
    // 主进程->渲染进程
    // mainWindow.send('get-tracks', updateTracks)
    mainWindow.webContents.send('get-tracks', updateTracks)
  })

  ipcMain.on('add-music-window', () => {
    console.log('hello from index page');

    const addWindow = new AppWindow({
      width: 800,
      height: 600,
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
      // 另一个渲染时机是：首次进入渲染（使用Event: 'did-finish-load'：导航完成时触发，即选项卡的旋转器将停止旋转，并指派onload事件后。）
      const updateTracks = myStore.addTracks(musicFilePaths).getTracks()
      console.log(updateTracks);
      // mainWindow.send('get-tracks', updateTracks)
      mainWindow.webContents.send('get-tracks', updateTracks)
    })
  })

  // 收到渲染进程删除当前音乐消息
  ipcMain.on('delete-track', (event, id) => {
    console.log('收到渲染进程删除当前音乐消息', id);
    const updatedTracks = myStore.deleteTrack(id).getTracks()
    mainWindow.webContents.send('get-tracks', updatedTracks)
  })

  // Open the DevTools.也可以直接通过浏览器的快捷键o+c+i
  mainWindow.webContents.openDevTools()

}

// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
  createWindow()

  // 窗口无法在 ready 事件前创建，so在初始化后监听 activate 事件
  app.on('activate', () => {
    // 如果没有窗口打开则打开一个窗口 (macOS)
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序。
// 为了实现这一点，监听 app 模块的 'window-all-closed' 事件。如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 用于保存后端自动刷新（直接用nodemon更好）
// try {
//   require('electron-reloader')(module,{});
// } catch (_) {}
