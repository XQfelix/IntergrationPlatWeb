import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Import from '@/components/Import'
import Select from '@/components/Select'
import DetailFull from '@/components/DetailFull'
import Modify from '@/components/Modify'

Vue.use(Router)

export default new Router({
  mode:'history', 
  routes: [
    {
      path: '/code/',
      name: 'home',
      component: Home
    },
    {
      path: '/code/import/:id',
      name: 'import',
      component: Import
    },
    {
      path: '/code/select',
      name: 'select',
      component: Select
    },
    {
      path: '/code/detail/:id',
      name: 'detail',
      component: DetailFull
    },
    {
      path: '/code/detail/:id/modify',
      name: 'modify',
      component: Modify
    },
  ],
})
