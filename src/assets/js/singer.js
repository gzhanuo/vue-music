export default class Singer {
    constructor({id, mid, name}) {
        this.id = id
        this.mid = mid
        this.name = name
        this.picUrl = `https://y.gtimg.cn/music/photo_new/T001R800x800M000${mid}.jpg?max_age=2592000`
    }
}