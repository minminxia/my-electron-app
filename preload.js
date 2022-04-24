// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
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
