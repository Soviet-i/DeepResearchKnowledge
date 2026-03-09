import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 使用相对路径确保稳定
const HomePage = () => import('../views/HomePage.vue')
const LoginPage = () => import('../views/auth/LoginPage.vue')
const RegisterPage = () => import('../views/auth/RegisterPage.vue')
const ResearchPage = () => import('../views/research/ResearchPage.vue')
const NotFoundPage = () => import('../views/error/NotFoundPage.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { title: '首页 - 深知DeepResearch' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: '登录 - 深知DeepResearch' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { title: '注册 - 深知DeepResearch' }
  },
  {
    path: '/research',
    name: 'Research',
    component: ResearchPage,
    meta: { title: '深度研究 - 深知DeepResearch' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 更新页面标题
router.afterEach((to) => {
  const title = to.meta.title as string || '深知DeepResearch'
  document.title = title
})

export default router
