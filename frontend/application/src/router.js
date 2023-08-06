import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import ServiceLevelManagement from './views/slm/slm.vue'
import slmHome from './views/slm/slmHome.vue'
import slmRoles from './views/slm/slmRoles.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/slm',
    name: 'slm',
    component: ServiceLevelManagement,
    children: [
      { path: '', name: 'slm-home', component: slmHome },
      { path: 'roles', name: 'slm-roles',component: slmRoles },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
