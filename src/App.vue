<template>
    <div id="app">
        <m-header></m-header>
        <tab></tab>
        <keep-alive>
            <router-view/>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
import MHeader from './components/MHeader'
import Tab from './components/Tab'
import Player from './components/Player'

export default {
    name: 'App',
    components: {
        MHeader,
        Tab,
        Player
    }  
}
</script>

