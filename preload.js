// 进程通讯
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addMusicWindow: () => ipcRenderer.send('add-music-window'),
  selectMusic: () => ipcRenderer.send('select-music'),

  openFile: () => ipcRenderer.invoke('dialog:openFile'),


})
