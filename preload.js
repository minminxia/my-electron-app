// 进程通讯
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addMusicWindow: () => ipcRenderer.send('add-music-window'),

  openFile: () => ipcRenderer.invoke('dialog:openFile'),


})
