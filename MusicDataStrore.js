const Store = require('electron-store')
const uuidV4 = require('uuid/v4')
const path = require('path')

class DataStore extends Store{
  constructor(settings){
    super(settings)
    this.tracks = this.get('tracks') || []
  }

  saveTracks(){
    this.set('tracks', this.tracks)
    return this
  }

  getTracks(){
    this.get('tracks', this.tracks)
    return this
  }

  addTracks(tracks){
    // 注意要去重
    const tracksWithProps = tracks.map((track)=>{
      return {
        id: uuidV4(),
        path: track,
        fileName: path.basename(track)

      }
    }).filter((track)=>{
      const currentTrackPath = this.getTracks().map(track => track.path)
      return currentTrackPath.indexOf(track.path) < 0
    })
    this.tracks = {...this.track, ...tracksWithProps}
    return this.saveTracks()
  }
}

module.exports = DataStore