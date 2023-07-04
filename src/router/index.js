import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/center',
    name: 'CenterList',
    component: () => import(/* webpackChunkName: "about" */ '../views/Center/CenterList.vue')
  },
  {
    path: '/center/create',
    name: 'CenterCreate',
    component: () => import(/* webpackChunkName: "about" */ '../views/Center/CenterCreate.vue')
  },
  {
    path: '/center/detail/:centerId',
    name: 'CenterDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/Center/CenterDetail.vue')
  },
  {
    path: '/club',
    name: 'ClubList',
    component: () => import(/* webpackChunkName: "about" */ '../views/Club/ClubList.vue')
  },
  {
    path: '/club/create',
    name: 'ClubCreate',
    component: () => import(/* webpackChunkName: "about" */ '../views/Club/ClubCreate.vue')
  },
  {
    path: '/club/detail/:clubId',
    name: 'ClubDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/Club/ClubDetail.vue')
  },
  {
    path: '/capsule/',
    name: 'CapsuleList',
    component: () => import(/* webpackChunkName: "about" */ '../views/Capsule/CapsuleList.vue')
  },
  {
    path: '/capsule/create',
    name: 'CapsuleCreate',
    component: () => import(/* webpackChunkName: "about" */ '../views/Capsule/CapsuleCreate.vue')
  },
  {
    path: '/capsule/detail/:capsuleId',
    name: 'CapsuleDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/Capsule/CapsuleDetail.vue')
  },
  {
    path: '/adminLogin',
    name: 'AdminLogin',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminLogin.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
