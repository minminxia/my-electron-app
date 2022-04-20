// import {ipcRenderer} from 'electron';
import { $ } from './helper.js';

$('addMusicBtn').addEventListener('click', ()=>{
  console.log('addMusicBtnClick');
  // ipcRenderer.send('addMusicWindow')
  window.electronAPI.addMusicWindow()
})

