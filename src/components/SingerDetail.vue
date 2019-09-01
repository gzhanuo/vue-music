<template>
    <transition name="slide">
        <music-list :songs="songList"
            :title="title"
            :bgImage="bgImage"
        ></music-list>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import {getSingerDetail, getVkey} from '../api/singer'
import {ERR_OK} from '../api/config'
import {createSong} from '../assets/js/song'
import MusicList from './MusicList'

export default {
    name: 'SingerDetail',
    data() {
        return {
            songList: []
        }
    },
    computed: {
        title() {
            return this.singer.name
        },
        bgImage() {
            return this.singer.picUrl
        },
        ...mapGetters([
            'singer'
        ])
    },
    created() {
        this._getSingerDetail()
    },
    methods: {
        _getSingerDetail() {
            if(!this.singer.id) {
                this.$router.push('/singer')
                return
            }
            getSingerDetail().then((res) => {
                if(res.singer.code === ERR_OK) {
                    this.songList = this._normalizeSongs(res.singer.data.songlist)
                }
            })
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((item) => {
                if(item.mid && item.album.mid) {
                    getVkey(item.mid).then((res) => {
                        if(res.code === ERR_OK) {
                            const vkey = res.req_0.data.midurlinfo[0].vkey
                            const newSong = createSong(item, vkey)
                            ret.push(newSong)
                        }
                    })
                }
            })
            return ret
        }
    },
    components: {
        MusicList
    }
}
</script>

<style lang="stylus" scoped>
    @import "../assets/stylus/variable"

    .slide-enter-active,
    .slide-leave-active
        transition all 0.3s
    .slide-enter,
    .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>