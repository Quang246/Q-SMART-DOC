import { createRouter, createWebHistory } from 'vue-router';
import SignInForm from '@/components/Auth/SignInForm.vue';
import SignUpForm from '@/components/Auth/SignUpForm.vue';
import ForgotForm from '@/components/Auth/ForgotForm.vue';
const routes = [
  {
    path: '/',
    redirect: '/login', // Đường dẫn mặc định chuyển hướng đến /login
  },
  {
    path: '/login',
    name: 'Login',
    component: SignInForm, // Trang đăng nhập
  },
  {
    path: '/register',
    name: 'Register',
    component: SignUpForm, // Trang đăng ký
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: ForgotForm, // Trang đăng ký
  },
  // Thêm các route khác ở đây nếu cần
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
