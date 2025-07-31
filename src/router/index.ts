import { createWebHistory, createRouter } from 'vue-router'


// Student pages
import StudentLogin from '../pages/StudentInfo.vue'
import TestView from '../pages/TestWizard.vue'


// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import AdminLogin from '../pages/admin/AdminLogin.vue'
import SidebarAdmin from '../components/SidebarAdmin.vue'
import AddWriting from '../pages/admin/AddWriting.vue'
import AddListening from '../pages/admin/AddListening.vue'
import AddReading from '../pages/admin/AddReading.vue'


const routes = [
  { path: '/', component: StudentLogin },
  { path: '/student-test', component: TestView },

  { path: '/admin/login', component: AdminLogin },
    {
    path: '/admin',
    component: SidebarAdmin,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: AdminDashboard },
      { path: 'add-writing', component: AddWriting },
      { path: 'add-listening', component: AddListening },
      { path: 'add-reading', component: AddReading },
      // { path: 'results', component: ViewResults },
      // { path: 'score-writing', component: ScoreWriting },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && localStorage.getItem('isAdmin') !== 'true') {
    next('/admin/login')
  } else {
    next()
  }
})

export default router
