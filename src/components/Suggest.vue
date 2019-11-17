<template>
    <scroll class="suggest" 
            :data="result" 
            :pullUp="pullUp"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll"
            ref="suggest"
    >
        <ul class="suggest-list">
            <li class="suggest-item"
                v-for="(item, index) in result" 
                :key="index"
                @click="selectItem(item)"
            >
                <div class="icon">
                    <i class="iconfont" :class="getIconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!result.length && !hasMore">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
import {search} from '../api/search'
import {ERR_OK} from '../api/config'
import {createSong, filterSinger} from '../assets/js/song'
import {getplaysongvkey} from '../api/singer'
import Scroll from '../base/Scroll'
import Loading from '../base/Loading'
import Singer from '../assets/js/singer'
import NoResult from '../base/NoResult'
import { mapMutations, mapActions } from 'vuex'

const  TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
    name: 'Suggest',
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            result: [],
            pullUp: true,
            hasMore: true,
            beforeScroll: true
        }
    },
    methods: {
        selectItem(item) {
            if(item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id: item.singerid,
                    mid: item.singermid,
                    name: item.singername
                })
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            }else {
                if(item.songid && item.albumid) {
                    let vkey = ''
                    getplaysongvkey(item.songmid).then((res) => {
                        if(res.code === ERR_OK) {
                            vkey = res.req_0.data.midurlinfo[0].purl
                            const newSong = createSong(item, vkey)
                            this.insertSong(newSong)
                        }
                    })
                }
            }
            this.$emit('select')
        },
        listScroll() {
            this.$emit('listScroll')
        },
        _search() {
            this.hasMore = true
            this.page = 1
            this.$refs.suggest.scrollTo(0, 0)
            search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
                if(res.code === ERR_OK) {
                    this.result = this._genResult(res.data)
                    // this.result = this._genResult(res.data)
                    this.checkMore(res.data)
                }
            })
        },
        getIconClass(item) {
            if(item.type === TYPE_SINGER) {
                return 'icon-user'
            }else {
                return 'icon-musicfill'
            }
        },
        checkMore(data) {
            const song = data.song
            if(!song.list.length || song.curnum + song.curpage * PERPAGE > song.totalnum) {
                this.hasMore = false
            }
        },
        searchMore() {
            if(!this.hasMore) {
                return
            }
            this.page++
            search(this.query, this.page, !this.showSinger, PERPAGE).then((res) => {
                if(res.code === ERR_OK) {
                        this.result = this.result.concat(this._genResult(res.data))
                    // let ret = this._normalizeSongs(res.data.song.list)
                    this.checkMore(res.data)
                }
            })
        },
        getDisplayName(item) {
            if(item.type === TYPE_SINGER) {
                return '歌手：' + item.singername
            }else {
                return `${item.songname}-${filterSinger(item.singer)}`
            }
        },
        refresh() {
            this.$refs.suggest.refresh()
        },
        _genResult(data) {
            let ret = []
            if(data.song) {
                ret = data.song.list
                // ret = this._normalizeSongs(data.song.list)
            }
            if(data.zhida && data.zhida.singerid) {
                ret.unshift({...data.zhida, ...{type: TYPE_SINGER}})
            }
            return ret
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    components: {
        Scroll,
        Loading,
        NoResult
    },
    watch: {
        query() {
            this._search()
        }
    }
}
</script>

<style lang="stylus" scoped>
    @import "../assets/stylus/variable"
    @import "../assets/stylus/mixin"

    .suggest
        height 100%
        overflow hidden
        .suggest-list
            padding 0 30px
            .suggest-item
                display flex
                align-items center
                padding-bottom 20px
                .icon
                    flex 0 0 30px
                    width 30px
                    font-size 14px
                    color $color-text-d
                .name
                    flex 1
                    font-size $font-size-medium
                    overflow hidden
                    .text
                        no-wrap()
        .no-result-wrapper
            position absolute 
            top 50%
            transform translateY(-50%)
            width 100%
</style>