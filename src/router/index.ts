import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Mode from '@/pages/Mode.vue'
import Select from '@/pages/Select.vue'
import Game from '@/pages/Game.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    { path: '/mode', name: 'mode', component: Mode },
    { path: '/select', name: 'select', component: Select },
    { path: '/game', name: 'game', component: Game },
  ],
})

export default router
