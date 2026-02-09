import { createRouter, createWebHashHistory } from '@ionic/vue-router';
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
      }
    ]
  },
  {
    path: '/edit/:id',
    component: () => import('@/views/EditExpensePage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory('/MobileWeb/docs/Lab6/'), // 👈 เพิ่m base path
  routes
})

export default router