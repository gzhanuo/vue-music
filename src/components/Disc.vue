<template>
    <transition name="slide">
        <music-list :title="title"
                    :bgImage="bgImage"
                    :songs="songList"
        ></music-list>
    </transition>
</template>

<script>
import MusicList from './MusicList'
import {mapGetters} from 'vuex'
import {getSongList} from '../api/recommend'
import { ERR_OK } from '../api/config'
import {getplaysongvkey} from '../api/singer'
import {createSong} from '../assets/js/song'

export default {
    name: 'Disc',
    data() {
        return {
            songList: []
        }
    },
    computed: {
        title() {
            return this.disc.dissname
        },
        bgImage() {
            return this.disc.imgurl
        },
        ...mapGetters([
            'disc'
        ])
    },
    methods: {
        _getSongList() {
            if(!this.disc.dissid) {
                this.$router.push('/recommend')
                return
            }
            getSongList(this.disc.dissid).then((res) => {
                if(res.code === ERR_OK) {
                    this.songList = this._normalizeSongs(res.cdlist[0].songlist)
                }
            })
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((item) => {
                if(item.mid && item.album.mid) {
                    let vkey = ''
                    getplaysongvkey(item.mid).then((res) => {
                        if(res.code === ERR_OK) {
                            vkey = res.req_0.data.midurlinfo[0].purl
                            const newSong = createSong(item, vkey)
                            ret.push(newSong)
                        }
                    })
                }
            })
            return ret
        }
    },
    created() {
        this._getSongList()
    },
    components: {
        MusicList
    }
}
</script>

<style lang="stylus" scoped >
    .slide-enter-avtive, 
    .slide-leave-active
        transition all 0.3s
    .slide-enter, 
    .slide-leave-to
        transform translate3d(100%, 0, 0)
</style>