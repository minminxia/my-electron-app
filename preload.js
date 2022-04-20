window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    // 使用了nodejs的process.versions[node]
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

// 进程通讯
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),

    // A common application for two-way IPC is calling a main process module from your renderer process code and waiting for a result. This can be done by using ipcRenderer.invoke paired with ipcMain.handle.
    openFile: () => ipcRenderer.invoke('dialog:openFile'),

    // page2-counter
    handleCounter: (callback) => ipcRenderer.on('update-counter', callback)

})
