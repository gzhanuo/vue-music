<template>
    <div class="singer" ref="singer">
        <list-view :singerList="singerList" @select="selectSinger" ref="list"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from '../api/singer'
import {ERR_OK} from '../api/config'
import Singer from '../assets/js/singer'
import ListView from '../base/ListView'
import {mapMutations} from 'vuex'
import {playlistMixin} from '../assets/js/mixin'

const pinyin = require('pinyin');
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
    name: 'Singer',
    mixins: [playlistMixin],
    data() {
        return {
            singerList: []
        }
    },
    created() {
        this._getSingerList()
    },
    methods: {
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        handlePlaylist(playList) {
            const bottom = playList.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.list.refresh()
        },
        _getSingerList() {
            getSingerList().then((res) => {
                if(res.singerList.code === ERR_OK) {
                    let list = res.singerList.data.singerlist
                    list.map((item) => {
                        let py = pinyin(item.singer_name[0], {
                            style: pinyin.STYLE_FIRST_LETTER
                        })
                        item.initial = py[0][0].toUpperCase()
                    })
                    this.singerList = this._normalizeSinger(list)
                }
            })
        },
        _normalizeSinger(list) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            list.forEach((item, index) => {
                if(index < HOT_SINGER_LEN) {
                    map.hot.items.push(new Singer({
                        id: item.singer_id,
                        mid: item.singer_mid,
                        name: item.singer_name,
                        picUrl: item.singer_pic
                    }))
                }

                const key = item.initial
                if(!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    }
                }
                map[key].items.push(new Singer({
                    id: item.singer_id,
                    mid: item.singer_mid,
                    name: item.singer_name,
                    picUrl: item.singer_pic
                }))
            })
            let hot = [],
                ret = []
            for(let key in map) {
                let value = map[key]
                if(value.title.match(/[A-Z]/)) {
                    ret.push(value)
                } else if(value.title === HOT_NAME) {
                    hot.push(value)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    components: {
        ListView
    }
}
</script>

<style lang="stylus" scoped>
    .singer
        position fixed
        top 88px
        bottom 0
        width 100%
</style>