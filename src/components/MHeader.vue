<template>
    <div class="header">
        <h1 class="text">PHONOGRAPH</h1>
        <router-link tag="div" class="mine" to="/user">
            <i class="iconfont icon-user"></i>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'MHeader'
}
</script>

<style lang="stylus" scoped>
    @import "../assets/stylus/variable"
    @import "../assets/stylus/mixin"

    .header
        podition relative 
        height 44px
        text-align center
        color $color-theme
        font-size 0
        .text
            display inline-block
            vertical-align top
            line-height 44px
            font-size $font-size-large
        .mine
            position absolute 
            top 0
            right 0
            .icon-user
                display block
                padding 12px
                font-size 20px
                color $color-theme
</style>