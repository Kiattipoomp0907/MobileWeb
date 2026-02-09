import { createRouter, createWebHashHistory } from '@ionic/vue-router'; // <--- 1. แก้ตรงนี้
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import AddExpensePage from '../views/AddExpensePage.vue'; 

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue') 
      },
      {
        path: 'tab2',
        component: AddExpensePage 
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      {
        path: '/edit/:id',
        component: () => import('@/views/EditExpensePage.vue')
      }
    ]
  }
]

const router = createRouter({
  // 👇 2. แก้ตรงนี้ให้เป็น HashHistory (วงเล็บว่างๆ ได้เลย)
  history: createWebHashHistory(),
  routes
})

export default router