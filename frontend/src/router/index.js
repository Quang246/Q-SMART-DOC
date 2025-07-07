import { createRouter, createWebHistory } from 'vue-router';
import SignInForm from '@/components/Auth/SignInForm.vue';
import SignUpForm from '@/components/Auth/SignUpForm.vue';
import ForgotForm from '@/components/Auth/ForgotForm.vue';
import Upload from '@/components/QLVB/Upload.vue'; 
import ListUser from '@/components/QLTK/ListUser.vue';
import ListDoc from '@/components/QLVB/ListDoc.vue';
import ActionPermission from '@/components/Permission/ActionPermission.vue';
import Action from '@/components/QLCN/Action.vue';
import Dashboard from '@/components/Dashboard/Dashboard.vue';
import ReportDoc from '@/components/Report/ReportDoc.vue';
import CategoryManagement from '@/components/Category/CategoryManagement.vue';
import History from '@/components/History/History.vue';
import ChangePass from '@/components/Auth/ChangePass.vue';
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
    path: '/qsdoc/doc-management',
    name: 'Upload',
    component: Upload,
    meta: { screenTitle: 'Quản lý tài liệu' }
  },
  {
    path: '/qsdoc/accont-management',
    name: 'ListUser',
    component: ListUser,
    meta: { screenTitle: 'Danh sách người dùng' }
  },
  {
    path: '/qsdoc/list-document',
    name: 'ListDoc',
    component: ListDoc,
    meta: { screenTitle: 'Danh sách tài liệu' }
  },
  {
    path: '/qsdoc/action-management',
    name: 'ActionPermission',
    component: ActionPermission,
    meta: { screenTitle: 'Phân quyền tài khoản' }
  },
  {
    path: '/qsdoc/action',
    name: 'Action',
    component: Action,
    meta: { screenTitle: 'Danh sách chức năng' }
  },
  {
    path: '/qsdoc/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { screenTitle: 'Dashboard' }
  },
  {
    path: '/qsdoc/report',
    name: 'Report',
    component: ReportDoc,
    meta: { screenTitle: 'Báo cáo thống kê tài liệu được truy cập' }
  },
  {
    path: '/qsdoc/list-category',
    name: 'CategoryManagement',
    component: CategoryManagement,
    meta: { screenTitle: 'Quản lý chuyên mục' }
  },
  {
    path: '/qsdoc/history',
    name: 'History',
    component: History,
    meta: { screenTitle: 'Lịch sử truy cập' }
  },
  {
    path: '/changepass',
    name: 'ChangePass',
    component: ChangePass,
    meta: { screenTitle: 'Đổi mật khẩu' }
  },
  // Thêm các route khác ở đây nếu cần
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
