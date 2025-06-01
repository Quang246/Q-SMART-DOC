import { createRouter, createWebHistory } from 'vue-router';
import SignInForm from '@/components/Auth/SignInForm.vue';
import SignUpForm from '@/components/Auth/SignUpForm.vue';
import ForgotForm from '@/components/Auth/ForgotForm.vue';
import Upload from '@/components/QLVB/Upload.vue'; 
import ListUser from '@/components/QLTK/ListUser.vue';
import Upload from '@/components/QLVB/Upload.vue';
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
  {
    path: '/Upload',
    name: 'Upload',
    component: Upload,
  },
  {
    path: '/ListUser',
    name: 'ListUser',
    component: ListUser,
  },
    path: '/upload',
    name: 'Upload',
    component: Upload,
  },
  // Thêm các route khác ở đây nếu cần
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
