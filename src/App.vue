<template>
    <div id="app">
        <m-header></m-header>
        <tab></tab>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </div>
</template>

<script>
import MHeader from './components/MHeader'
import Tab from './components/Tab'

export default {
    name: 'App',
    components: {
        MHeader,
        Tab
    }  
}
</script>

