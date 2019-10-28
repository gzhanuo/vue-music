import {getLyric} from '../../api/song'
import {ERR_OK} from '../../api/config'
import {Base64} from 'js-base64'

export default class Song {
    constructor({id, mid, singer, name, album, duration, img, url}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.img = img
        this.url = url
    }

    getLyric() {
        if(this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if(res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                    // eslint-disable-next-line no-console
                    // console.log(this.lyric)
                }else {
                    reject('no lyric')
                }
            })
        })
    }
}

export function createSong(song, vkey) {
    return new Song({
        id: song.id,
        mid: song.mid,
        singer: filterSinger(song.singer),
        name: song.name,
        album: song.album.name,
        duration: song.interval,
        img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${vkey}`
    })
}

export function filterSinger(singer) {
    let ret = []
    if(!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}