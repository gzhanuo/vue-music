<template>
    <div class="no-result">
        <div class="no-result-icon"></div>
        <p class="no-result-text">{{ title }}</p>
    </div>
</template>

<script>
export default {
    name: 'NoResult',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="stylus" scoped>
    @import "../assets/stylus/variable"
    @import "../assets/stylus/mixin"

    .no-result
        text-align center
        .no-result-icon
            width 90px
            height 90px
            margin 0 auto 
            background-image url('../assets/images/noresult.png')
            background-size 90px 90px
        .no-result-text
            margin-top 30px
            font-size $font-size-medium
            color $color-text-d
</style>