import { $ } from './helper.js';
// const path = require('path')

let musicFilePaths = []
const renderListHtml = (filePaths) => {
  const musicItemsHTML = filePaths.reduce((html, music)=>{
    html += `<li class="list-group-item">${music}</li>`
    // html += `<li class="list-group-item">${path.basename(music)}</li>`
    return html
  }, '')
  
  $('filePath').innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}

// 选择音乐
$('selectMusicBtn').addEventListener('click', async()=>{
  console.log('selectMusicBtnClick');
  // window.electronAPI.selectMusic()
  const filePaths = await window.electronAPI.openFile()
  console.log(filePaths);
  if(Array.isArray(filePaths)){
    renderListHtml(filePaths)
    musicFilePaths = filePaths
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

// 导入音乐
$('addMusicBtn').addEventListener('click', ()=>{
  console.log('addMusicBtn');
  // 发送选择的音乐到主进程，主进程通知index.js渲染导入的音乐
  window.electronAPI.addMusic(musicFilePaths)
})