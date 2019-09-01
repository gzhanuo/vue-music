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
        url: `http://ws.stream.qqmusic.qq.com/C400${song.mid}.m4a?guid=6187608800&vkey=${vkey}&uin=0&fromtag=66`
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