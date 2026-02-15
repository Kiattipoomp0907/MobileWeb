import { createRouter, createWebHashHistory } from '@ionic/vue-router'; // ✅ 1. เปลี่ยนเป็น HashHistory
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import { authService } from '@/auth/auth-service'; // เช็ค Path นี้ให้ถูกนะครับ

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    meta: { requiresAuth: true }, // ✅ ใส่ตรงนี้ ลูกๆ ทุก Tab จะโดนบังคับ Login หมด
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
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  // ✅ 2. ใช้ HashHistory เพื่อให้ URL มี # (แก้จอขาวบนมือถือ)
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// ✅ Auth Guard: กันคนไม่ Login เข้าใช้งาน
router.beforeEach(async (to, from, next) => {
  try {
    const user = await authService.getCurrentUser();
    
    // เช็คว่าหน้านี้ต้องการ Login ไหม? (ดูจาก meta: requiresAuth)
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    // กรณีที่ 1: ถ้าจะไปหน้า Login แต่มี User แล้ว -> ดีดไป Tab1 เลย (ไม่ต้อง Login ซ้ำ)
    if (to.path === '/login' && user) {
      next('/tabs/tab1');
      return;
    }

    // กรณีที่ 2: ถ้าจะไปหน้าลับ (Tabs) แต่ไม่มี User -> ดีดไป Login
    if (requiresAuth && !user) {
      next('/login');
      return;
    }

    // กรณีที่ 3: ผ่านได้ปกติ
    next();
    
  } catch (error) {
    console.error("Auth Guard Error:", error);
    next('/login'); // ถ้า Error อะไรแปลกๆ ให้ดีดไป Login ไว้ก่อนเพื่อความปลอดภัย
  }
});

export default router