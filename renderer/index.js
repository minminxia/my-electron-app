// import {ipcRenderer} from 'electron';

const addMusicBtn = document.getElementById('addMusicBtn')
addMusicBtn.addEventListener('click', ()=>{
  // ipcRenderer.send('addMusicWindow')
  window.electronAPI.addMusicWindow()
})