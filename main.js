// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

const createWindow = () => {
  // Create the browser window.
  // 主进程
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // 渲染进程-可以写js、nodejs等
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // 创建第二个窗口
  const mainWindow2 = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    // 父进程关闭则子进程关闭
    parent: mainWindow
  })

  // page2-counter
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow2.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => mainWindow2.webContents.send('update-counter', -1),
          label: 'Decrement',
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
  mainWindow2.loadFile('index2.html')

  // Open the DevTools.
  mainWindow2.webContents.openDevTools()
}

// 进程通讯(渲染进程->主进程)
ipcMain.on('set-title', (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // 进程通讯(主进程->渲染进程)
  // Listen for events with ipcMain.handle
  // https://www.electronjs.org/zh/docs/latest/tutorial/ipc
  ipcMain.handle('dialog:openFile', handleFileOpen)
  
  // page2-counter
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
