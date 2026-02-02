import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 登录守卫：未登录则跳转到登录页
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  // 白名单路由（无需登录）
  const whiteList = ['/login', '/register', '/404', '/'];

  if (whiteList.includes(to.path)) {
    next();
    return;
  }

  // 检查是否登录
  if (authStore.isLoggedIn) {
    next();
  } else {
    // 未登录，跳转到登录页，并记录当前路由用于登录后返回
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
};

// 已登录守卫：已登录则禁止访问登录/注册页
export const loggedInGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    // 跳转到首页
    next('/dashboard');
  } else {
    next();
  }
};
