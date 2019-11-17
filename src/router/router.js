import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../views/Recommend'
import Singer from '../views/Singer'
import Rank from '../views/Rank'
import Search from '../views/Search'
import SingerDetail from '../components/SingerDetail'
import Disc from '../components/Disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        redirect: '/recommend'
    },
    {
        path: '/recommend',
        component: Recommend,
        children: [
            {
                path: ':id',
                component: Disc
            }
        ]
    },
    {
        path: '/singer',
        component: Singer,
        children: [
            {
                path: ':id',
                component: SingerDetail
            }
        ]
    },
    {
        path: '/rank',
        component: Rank
    },
    {
        path: '/search',
        component: Search,
        children: [
            {
                path: ':id',
                component: SingerDetail
            }
        ]
    }
  ]
})
