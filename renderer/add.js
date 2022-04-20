import { $ } from './helper.js';

$('selectMusicBtn').addEventListener('click', ()=>{
  console.log('selectMusicBtnClick');
  window.electronAPI.selectMusic()
  // 调用原生文件API
  // const filePath = await window.electronAPI.openFile()
  // console.log(filePath);
})