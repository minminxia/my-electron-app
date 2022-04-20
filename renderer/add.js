import { $ } from './helper.js';
// const path = require('path')

const renderListHtml = (filePaths) => {
  const musicItemsHTML = filePaths.reduce((html, music)=>{
    html += `<li class="list-group-item">${music}</li>`
    // html += `<li class="list-group-item">${path.basename(music)}</li>`
    return html
  }, '')
  
  $('filePath').innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}

$('selectMusicBtn').addEventListener('click', async()=>{
  console.log('selectMusicBtnClick');
  // window.electronAPI.selectMusic()
  const filePaths = await window.electronAPI.openFile()
  console.log(filePaths);
  if(Array.isArray(filePaths)){
    renderListHtml(filePaths)
  }
})

// 监听到主进程发来的文件路径
// let musicFilePaths = []
// ipcRenderer.on('select-files', (event, path)=>{
//   if(Array.isArray(path)){
//     musicFilePaths = path
//     console.log(musicFilePaths);
//   }

// })