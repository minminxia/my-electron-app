import { $ } from './helper.js';

let allTracks
let currentTrack

$('addMusicBtn').addEventListener('click', ()=>{
  console.log('addMusicBtnClick');
  window.electronAPI.addMusicWindow()
})

// 渲染播放列表
{/* <i class="bi bi-pause-fill" data-id="${track.id}"></i> */}
const renderListHTML = (tracks) => {
  const tracksList = $('tracksList')
  const tracksListHTML = tracks.reduce((html, track) => {
    html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
      <div class="col-10">
        <i class="bi bi-music-note-beamed"></i>
        <b>${track.fileName}</b>
      </div>
      <div class="col-2">
        <i class="bi bi-play-fill" data-id="${track.id}"></i>
        <i class="bi bi-trash3-fill" data-id="${track.id}"></i>
      </div>
    </li>`
    return html
  }, '')
  const emptyTrackHTML = '<div class="alert alert-primary">还没有添加任何音乐</div>'
  tracksList.innerHTML = tracks.length ? `<ul class="list-group">${tracksListHTML}</ul>` : emptyTrackHTML
}

window.electronAPI.getTracks((event, tracks)=>{
  console.log('页面加载完成，主进程传来的播放路径', tracks, event);
  allTracks = tracks
  renderListHTML(tracks)
})

// 点击播放
$('tracksList').addEventListener('click', (event)=>{
  event.preventDefault()
  const {dataset, classList} = event.target
  console.log(dataset, classList);
  const id = dataset && dataset.id // 当前点击音乐ID

  const musicAudio = $('audioDom')
  const PLAY_BTN = 'bi-play-fill'
  const PAUSE_BTN = 'bi-pause-fill'
  const del_BTN = 'bi-trash3-fill'

  // 播放音乐
  // 点击播放按钮
  if(id && classList.contains(PLAY_BTN)) {
    // 开始播放音乐
    if(currentTrack && currentTrack.id === id){
      // 继续播放音乐
      musicAudio.play()
    } else {
      // 播放新的歌曲，还原之前的图标
      currentTrack = allTracks.find(track => track.id === id)
      musicAudio.src = currentTrack.path
      musicAudio.play()

      // 其他图标还原
      const resetIconEle = document.querySelector(`.${PAUSE_BTN}`)
      if(resetIconEle){
        debugger
        resetIconEle.classList.replace(PAUSE_BTN, PLAY_BTN)
      }
      // 当前图标修改
      classList.replace(PLAY_BTN,PAUSE_BTN)
    }

  } else if(classList.contains(PAUSE_BTN)){
    // 点击暂停按钮
    musicAudio.pause()
    classList.replace(PAUSE_BTN, PLAY_BTN)

  } else if(id && classList.contains(del_BTN)) {
    // 点击删除按钮
    window.electronAPI.deleteTracks(id)
  }
})


