<template>
    <div class="player" v-show="playList.length > 0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.img">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="iconfont icon-unfold"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle"
                     @touchstart.prevent="middleTouchStart"
                     @touchmove.prevent="middleTouchMove"
                     @touchend.prevent="middleTouchEnd"
                >
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd"  :class="cdClass">
                                <img class="image" :src="currentSong.img">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{ playingLyric }}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data=" currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                   class="text"
                                   :class="{'current': currentLineNum === index}"
                                   v-for="(line, index) in currentLyric.lines"
                                   :key="index"
                                >{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{ format(currentTime) }}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{ format(currentSong.duration) }}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i class="iconfont" :class="iconMode"></i>
                        </div>
                        <div class="icon i-left">
                            <i class="iconfont icon-backward" @click="prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i :class="playIcon" class="iconfont" @click="togglePlaying"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="iconfont icon-forward" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="iconfont icon-heart"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :class="cdClass" width="40" height="40" :src="currentSong.img">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="30" :percent="percent">
                        <i class="iconfont icon-mini" :class="playIcon" @click.stop="togglePlaying"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="iconfont icon-play-list-line"></i>
                </div>
            </div>
        </transition>
        <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '../assets/js/dom'
import ProgressBar from '../base/ProgressBar'
import ProgressCircle from '../base/ProgressCircle'
import {playMode} from '../assets/js/config'
import {shuffle} from '../assets/js/util'
import Lyric from 'lyric-parser'
import Scroll from '../base/Scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
    name: 'Player',
    data() {
        return {
            songReady: false,
            currentTime: 0,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: ''
        }
    },
    computed: {
        playIcon() {
            return this.playing ? 'icon-bofangzanting' : 'icon-bofang'
        },
        cdClass() {
            return this.playing ? 'play' : 'play pause'
        },
        percent() {
            return this.currentTime / this.currentSong.duration
        },
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-liebiaoxunhuan' : 
            this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suiji'
        },
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ])
    },
    created() {
        this.touch = {}
    },
    methods: {
        back() {
            this.setFullScreen(false)
        },
        open() {
            this.setFullScreen(true)
        },
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if(mode === playMode.random) {
                list = shuffle(this.sequenceList)
            }else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        getLyric() {
            this.currentSong.getLyric().then((lyric) => {
                this.currentLyric = new Lyric(lyric, this.handleLyric)
                if(this.playing) {
                    this.currentLyric.play()
                }
            }).catch(() => {
                this.currentLyric = null
                this.playingLyric = ''
                this.currentLineNum = 0
            })
        },
        handleLyric({lineNum, txt}) {
            this.currentLineNum = lineNum
            if(lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(lineEl, 1000)
            }else {
                this.$refs.lyricList.scrollToElement(0, 0, 1000)
            }
            this.playingLyric = txt
        },
        end() {
            if(this.mode === playMode.loop) {
                this.loop()
            }else {
                this.next()
            }
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if(this.currentLyric) {
                this.currentLyric.seek()
            }
        },
        next() {
            // if(!this.songReady) {
            //     return
            // }
            if(this.playList.length === 1) {
                this.loop()
            }else {
                let index = this.currentIndex + 1
                if(index === this.playList.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if(!this.playing) {
                    this.togglePlaying()
                }
            }
            this.songReady = false
        },
        prev() {
            // if(!this.songReady) {
            //     return
            // }
            if(this.playList.length === 1) {
                this.loop()
            }else {
                let index = this.currentIndex - 1
                if(index === -1) {
                    index = this.playList.length - 1
                }
                this.setCurrentIndex(index)
                if(!this.playing) {
                    this.togglePlaying()
                }
            }
            this.songReady = false
        },
        onProgressBarChange(percent) {
            const current = this.currentSong.duration * percent
            this.$refs.audio.currentTime = current
            if(!this.playing) {
                this.togglePlaying()
            }
            if(this.currentLyric) {
                this.currentLyric.seek(current * 1000)
            }
        },
        ready() {
            this.songReady = true
        },
        error() {
            this.songReady = true
        },
        updateTime(e) {
            this.currentTime = e.target.currentTime
        },
        format(interval) {
            interval = interval | 0
            const minute = interval / 60 | 0
            const second = this._pad(interval % 60)
            return `${minute}:${second}`
        },
        _pad(num, n = 2) {
            let len = num.toString().length
             while(len < n) {
                 num = '0' + num
                 len++
             }
             return num
        },
        enter(el, done) {
            const {x,y,scale} = this._getPosAndScale()

            let animation = {
                0: {
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0, 0, 0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0, 0, 0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })

            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter() {
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x, y, scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave() {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        togglePlaying() {
            // if(!this.songReady) {
            //     return
            // }
            this.setPlayingState(!this.playing)
            if(this.currentLyric) {
                this.currentLyric.togglePlay()
            }
        },
        middleTouchStart(e) {
            this.touch.initial = true
            this.touch.startX = e.touches[0].pageX
            this.touch.startY = e.touches[0].pageY
        },
        middleTouchMove(e) {
            if(!this.touch.initial) {
                return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            if(Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }

            //分情况判断左侧距离
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            const width = Math.min(Math.max(-window.innerWidth, left + deltaX), 0)
            this.touch.percent = Math.abs(width / window.innerWidth)
            this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px, 0, 0)`
            this.$refs.lyricList.$el.style[transitionDuration] = 0
            this.$refs.middleL.style.opacity = 1 - this.touch.percent
            this.$refs.middleL.style[transitionDuration] = 0
        },
        middleTouchEnd() {
            let width
            let opacity
            if(this.currentShow === 'cd') {
                if(this.touch.percent > 0.1) {
                    width = -window.innerWidth
                    opacity = 0
                    this.currentShow = 'lyric'
                }else {
                    width = 0
                    opacity = 1
                }
            }else {
                if(this.touch.percent < 0.9) {
                    width = 0
                    opacity = 1
                    this.currentShow = 'cd'
                }else {
                    width = -window.innerWidth
                    opacity = 0
                }
            }
            this.$refs.middleL.style.opacity = opacity
            this.$refs.middleL.style[transitionDuration] = '300ms'
            this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px, 0, 0)`
            this.$refs.lyricList.$el.style[transitionDuration] = '300ms'
        },
        _getPosAndScale() {
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft) 
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        })
    },
    watch: {
        currentSong(newSong, oldSong) {
            if(newSong.id === oldSong.id) {
                return
            }
            if(this.currentLyric) {
                this.currentLyric.stop()
            }
            setTimeout(() => {
                this.$refs.audio.play()
                this.getLyric()
            }, 1000)
        },
        playing(newPlaying) {
            this.$nextTick(() => {
                const audio = this.$refs.audio
                newPlaying ? audio.play() : audio.pause()
            })
        }
    },
    components: {
        ProgressBar,
        ProgressCircle,
        Scroll
    }
}
</script>

<style lang="stylus" scoped>
    @import "../assets/stylus/variable"
    @import "../assets/stylus/mixin"

    .player
        .normal-player
            position fixed
            left 0
            top 0
            right 0
            bottom 0
            z-index 150
            background $color-background
            .background
                position absolute 
                left 0
                top 0
                width 100%
                height 100%
                z-index -1 
                opacity 0.6
                filter blur(20px)
            .top
                position relative
                margin-bottom 25px
                .back
                    position absolute 
                    top 0
                    left 6px
                    z-index 50
                    .icon-unfold
                        display block
                        padding 9px
                        font-size $font-size-large-x
                        color $color-theme
                .title 
                    width 70%
                    margin 0 auto 
                    line-height 40px
                    text-align center
                    no-wrap()
                    font-size $font-size-large
                    color $color-text
                .subtitle 
                    line-height 20px
                    text-align center
                    font-size $font-size-medium
                    color $color-text
            .middle 
                position fixed
                width 100%
                top 80px
                bottom 170px
                white-space nowrap 
                font-size 0
                .middle-l
                    display inline-block
                    vertical-align top
                    position relative
                    width 100%
                    height 0
                    padding-top 80%
                    .cd-wrapper
                        position absolute 
                        left 10%
                        top 0
                        width 80%
                        height 100%
                        .cd 
                            width 100%
                            height 100%
                            box-sizing border-box
                            border 10px solid rgba(255, 255, 255, 0.1)
                            border-radius 50%
                            &.play
                                animation: rotate 20s linear infinite
                            &.pause 
                                animation-play-state: paused
                            .image 
                                position absolute 
                                left 0
                                top 0
                                width 100%
                                height 100%
                                border-radius 50%
                    .playing-lyric-wrapper
                        width 80%
                        margin 30px auto 0 auto
                        overflow hidden
                        text-align center
                        .playing-lyric
                            height 20px
                            line-height 20px
                            font-size $font-size-medium
                            color $color-text-l
                .middle-r
                    display inline-block
                    vertical-align top
                    width 100%
                    height 100%
                    overflow hidden
                    .lyric-wrapper
                        width 80%
                        margin 0 auto
                        overflow hidden
                        text-align center
                        .text
                            line-height 32px
                            color $color-text-l
                            font-size $font-size-medium
                            &.current
                                color $color-text

            .bottom 
                position absolute 
                bottom 50px
                width 100%
                .dot-wrapper
                    text-align center
                    font-size 0
                    .dot 
                        display inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l
                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll
                .progress-wrapper
                    display flex
                    align-items center
                    width 80%
                    margin 0 auto
                    padding 10px 0
                    .time 
                        color $color-text
                        font-size $font-size-small
                        flex 0 0 30px
                        line-height 30px
                        width 30px
                        &.time-l
                            text-align right
                        &.time-r
                            text-align left
                    .progress-bar-wrapper
                        flex 1
                        padding 0 5px
                .operators
                    display flex
                    align-items center
                    .icon
                        flex 1
                        color $color-theme
                        i 
                            font-size 20px
                        .icon-liebiaoxunhuan
                            font-size 20px
                        .icon-suiji
                            font-size 20px
                        .icon-danquxunhuan
                            font-size 20px
                    .i-left
                        text-align right
                    .i-center
                        padding 0 20px
                        text-align center
                        i 
                            font-size 40px
                    .i-right 
                        text-align left 
            &.normal-enter-active, &.normal-leave-active
                transition all 0.4s
                .top, .bottom 
                    transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity 0
                .top 
                    transform translate3d(0, -100px, 0)
                .bottom 
                    transform translate3d(0, 100px, 0)
        .mini-player
            display flex
            align-items center
            position fixed
            left 0
            bottom 0
            z-index 180
            width 100%
            height 60px
            background $color-highlight-background
            &.mini-enter-active, &.mini-leave-active
                transition all 0.4s
            &.mini-enter, &.mini-leave-to
                opacity 0
            .icon
                flex 0 0 40px
                width 40px
                padding 0 10px 0 20px
                img 
                    border-radius 50%
                    &.play
                        animation rotate 10s linear infinite
                    &.pause
                        animation-play-state paused
            .text
                display flex
                flex-direction column
                justify-content center
                flex 1
                line-height 20px
                overflow hidden
                .name 
                    margin-bottom 2px
                    no-wrap()
                    font-size $font-size-medium
                    color $color-text
                .desc 
                    no-wrap()
                    font-size $font-size-small
                    color $color-text-d
            .control
                flex 0 0 30px
                width 30px
                padding 0 10px
                .icon-bofang, .icon-bofangzanting
                    font-size 20px
                    color $color-theme-d
                .icon-play-list-line
                    font-size 30px
                    color $color-theme-d
                .icon-mini
                    position absolute
                    top 5px
                    left 6px
                    font-size 20px
    @keyframes rotate 
        0% 
            transform rotate(0)
        100%
            transform rotate(360deg)
</style>