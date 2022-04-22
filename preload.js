// 进程通讯
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addMusicWindow: () => ipcRenderer.send('add-music-window'),

  selectMusic: () => ipcRenderer.send('select-music'),

  // 通过invoke去通知主进程ipcMain.handle获取文件
  openFile: () => ipcRenderer.invoke('dialog:openFile'),

  addMusic: (musicFilePaths) => ipcRenderer.send('add-music', musicFilePaths),

  getTracks: (callback) => ipcRenderer.on('get-tracks', callback),

  deleteTracks: (id) => ipcRenderer.send('delete-track', id)

})
