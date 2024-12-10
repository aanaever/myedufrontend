import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import CoursesDashboard from "@/views/admin/CoursesDashboard.vue";
import AddCourse from '@/views/admin/AddCourse.vue';
import EditUser from '@/views/admin/EditUser.vue';
import EditCourse from '@/views/admin/EditCourse.vue';
import UsersDashboard from '@/views/admin/UsersDashboard.vue';
import AdminLogin from '@/views/admin/AdminLogin.vue';
import TeachersDashboard from '@/views/admin/TeachersDashboard.vue';
import SignupTeacher from '@/views/SignupTeacher.vue';
import TeacherCourses from "@/views/teacher/TeacherCourses.vue";
import TeacherProfile from "@/views/teacher/TeacherProfile.vue";
import TeacherPurchaseHistory from "@/views/teacher/TeacherPurchaseHistory.vue";
import TeacherAddCourse from '@/views/teacher/TeacherAddCourse.vue';
import useStudentStore from "@/stores/modules/studentStore";
import TeacherEditCourse from '@/views/teacher/TeacherEditCourse.vue'; 

const routes = [
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true, hideNavbar: true, hideFooter: true },
    children: [
      { path: 'users', name: 'UsersDashboard', component: UsersDashboard },
      { path: 'teachers', name: 'TeachersDashboard', component: TeachersDashboard },
      { path: 'courses', name: 'CoursesDashboard', component: CoursesDashboard },
      { path: 'add-course', name: 'AddCourse', component: AddCourse },
      { path: 'edit-user/:userId', name: 'EditUser', component: EditUser },
      { path: 'edit-course/:courseId', name: 'EditCourse', component: EditCourse },
    ]
  },
  { 
    path: "/", 
  name: "Home", 
  component: Home 
  },
  { 
    path: "/cart", 
    name: "Cart", component: () => import("@/views/Cart.vue"), 
    meta: { hideFooter: true } 
  },

  { path: "/login",
    name: "Login", 
    component: () => import("@/views/Login.vue") 
  },
  {
    path: '/teacher/edit-course/:courseId',
    name: 'TeacherEditCourse',
    component: TeacherEditCourse,
    props: true,
    meta: { requiresAuth: true, requiresTeacher: true }
  },
  
  { path: "/signup", name: "SignUp", component: () => import("@/views/Signup.vue") },
  { path: "/signup-teacher", name: "SignupTeacher", component: SignupTeacher },
  { path: "/search", name: "SearchResults", component: () => import("@/views/SearchResults.vue") },
  { path: "/category/:name", name: "Category", component: () => import("@/views/Category.vue") },
  { path: "/course/:id(\\d+)", name: "Course", component: () => import("@/views/Course.vue") },
  { path: "/checkout", name: "Checkout", component: () => import("@/views/Checkout.vue"), meta: { requireLogin: true, hideFooter: true } },
  { path: "/account/profile", name: "Profile", component: () => import("@/views/user/MyProfile.vue"), meta: { requireLogin: true } },
  { path: "/account/wishlist", name: "Wishlist", component: () => import("@/views/user/Wishlist.vue"), meta: { requireLogin: true, hideFooter: true } },
  { path: "/account/learning", name: "MyLearning", component: () => import("@/views/user/MyLearning.vue"), meta: { requireLogin: true, hideFooter: true } },
  { path: "/account/purchase-history", name: "PurchaseHistory", component: () => import("@/views/user/PurchaseHistory.vue"), meta: { requireLogin: true } },
  { path: "/account/learning/course/:courseId(\\d+)", name: "ResumeCourse", component: () => import("@/views/ResumeCourse.vue"), meta: { hideNavbar: true, hideFooter: true } },
  { path: "/videoplayer/course/:courseId(\\d+)/lesson/:lessonId", name: "VideoPlayer", component: () => import("@/views/VideoPlayer.vue"), meta: { requireLogin: true } },
  { path: "/teacher/profile", name: "TeacherProfile", component: TeacherProfile, meta: { requireLogin: true } },
  { path: "/teacher/courses", name: "TeacherCourses", component: TeacherCourses, meta: { requireLogin: true } },
  { path: "/teacher/add-course", name: "TeacherAddCourse", component: TeacherAddCourse, meta: { requireLogin: true } },
  { path: "/teacher/purchase-history", name: "TeacherPurchaseHistory", component: TeacherPurchaseHistory, meta: { requireLogin: true } },
  { path: "/about", name: "About", component: () => import("@/views/About.vue") },
  { path: "/Error500", name: "ServerError", component: () => import("@/views/Error500.vue"), meta: { hideNavbar: true, hideFooter: true } },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/Error404.vue"), meta: { hideNavbar: true, hideFooter: true } }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresTeacher = to.matched.some(record => record.meta.requiresTeacher);

  const store = useStudentStore();
  await store.getLoginStatus();
  console.log("Logged in:", store.loggedIn, "Role:", store.role);

  if (requiresAuth && !store.loggedIn) {
    next({ name: 'Login' });
  } else if (requiresAdmin && !store.isAdmin) {
    next({ name: 'UsersDashboard' });
  } else if (requiresTeacher && !store.isTeacher) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
