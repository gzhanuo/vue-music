<template>
  <div class="recommend">
      <scroll class="recommend-content" :data="discList" ref="scroll">
          <div>
            <div v-if="recommends.length" class="slider-wrapper">
                <slider>
                    <div v-for="item in recommends" :key="item.id">
                        <a :href="item.linkUrl">
                            <img :src="item.picUrl" @load="loadImage" class="needsclick">
                        </a>
                    </div>
                </slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                    <li v-for="item in discList" :key="item.dissid" class="item">
                        <div class="icon">
                            <img v-lazy="item.imgurl">
                        </div>
                        <div class="text">
                            <h2 class="name">{{ item.dissname }}</h2>
                            <p class="desc">{{ item.creator.name }}</p>
                        </div>
                    </li>
                </ul>
            </div>
          </div>
          <div class="loading-container" v-show="!discList.length">
                <loading></loading>
          </div>
      </scroll>
  </div>
</template>

<script>
// @ is an alias to /src
import Slider from '../base/slider'
import Scroll from '../base/scroll'
import Loading from '../base/loading'
import {getRecommend, getDiscList} from '../api/recommend'
import {ERR_OK} from '../api/config'

export default {
  name: 'Recommend',
  data() {
      return {
          recommends: [],
          discList: []
      }
  },
  components: {
      Slider,
      Scroll,
      Loading
  },
  created() {
      this._getRecommend()
      this._getDiscList()
  },
  methods: {
      _getRecommend() {
          getRecommend().then((res) => {
              if(res.code === ERR_OK) {
                  this.recommends = res.data.slider
              }
          })
      },
      _getDiscList() {
          getDiscList().then((res) => {
              if(res.code === ERR_OK) {
                  this.discList = res.data.list
              }
          })
      },
      loadImage() {
          if(!this.checkloaded) {
              this.checkloaded = true
              this.$refs.scroll.refresh()
          }
      }
  }
}
</script>

<style lang="stylus" scoped>
    @import "../assets/stylus/variable"

    .recommend
        position fixed
        width 100%
        top 88px
        bottom 0
        .recommend-content
            height 100%
            overflow hidden
            .slider-wrapper
                position relative
                width 100%
                overflow hidden
            .recommend-list
                .list-title
                    height 65px
                    line-height 65px
                    text-align center
                    font-size $font-size-medium
                    color $color-theme
                .item
                    display flex
                    box-sizing border-box
                    align-items center
                    padding 0 20px 20px 20px
                    .icon
                        flex 0 0 60px
                        width 60px
                        height 60px
                        padding-right 20px
                        img 
                            width 60px
                            height 60px
                    .text
                        display flex
                        flex-direction column
                        justify-content center
                        flex 1
                        line-height 20px
                        overflow hidden
                        font-size $font-size-medium
                        .name
                            margin-bottom 10px
                            color $color-text
                        .desc
                            color $color-text-d
            .loading-container
                position absolute 
                width 100%
                top 50%
                transform: transformY(-50%)
</style>
