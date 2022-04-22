import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MachineView from '../views/MachineView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: MachineView
  },
  {
    path: '/machine',
    name: 'machine',
    component: MachineView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
