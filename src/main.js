import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import './assets/stylus/index.styl'

Vue.config.productionTip = false
fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
    loading: require('./assets/images/default.png')
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
