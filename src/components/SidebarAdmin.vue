<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside style="background-color: #363740; width: 20%;" class="flex flex-col justify-between">
      <!-- Navigation -->
      <nav>
         <div class="flex items-center justify-center">
          <img style="width: 65%; height: auto; padding: 50px 0; opacity: 0.7;" src="../assets/images/mock.jpg" alt="Logo"></img>
         </div>
        <!-- Dashboard -->
        <RouterLink 
          to="/admin"
          :class="['case', $route.path === '/admin' ? 'active' : '']"
        >
          <LayoutDashboard class="sidebar-icon w-5 h-5 mr-4" />
          <h2 class="option">Dashboard</h2>
        </RouterLink>

        <!-- Add Questions Submenu -->
        <div>
          <button
            @click="toggleAddMenu"
            :class="['case', $route.path.startsWith('/admin/add-') ? 'active' : '']"
          >
            <FolderPlus class="sidebar-icon w-5 h-5 mr-4" />
            <h2 class="option">Add Questions</h2>
            <ChevronDown v-if="!showAddMenu" class="sidebar-icon w-5 h-5 ml-auto" />
            <ChevronUp v-else class="sidebar-icon w-5 h-5 ml-auto" />
          </button>

          <ul v-if="showAddMenu" class="pl-6 mt-2 space-y-1">
            <li>
              <RouterLink to="/admin/add-writing" class="case" active-class="active">
                <h2 class="option">Writing</h2>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/admin/add-listening" class="case" active-class="active">
                <h2 class="option">Listening</h2>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/admin/add-reading" class="case" active-class="active">
                <h2 class="option">Reading</h2>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- View Results -->
        <div>
          <RouterLink to="/admin/results" class="case" active-class="active">
            <FileUser class="sidebar-icon w-5 h-5 mr-4" />
            <h2 class="option">View Student Results</h2>
          </RouterLink>
        </div>

        <!-- Score Writing -->
        <div>
          <RouterLink to="/admin/score-writing" class="case" active-class="active">
            <NotebookPenIcon class="sidebar-icon w-5 h-5 mr-4" />
            <h2 class="option">Score Writing</h2>
          </RouterLink>
        </div>
      </nav>

      <!-- Logout at Bottom -->
      <div class="px-10 pb-8">
        <button
          @click="logout"
          class="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
        >
          <LogOut class="w-5 h-5 mr-4" />
          <h2 class="text-center">Logout</h2>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutDashboard, FileUser, LogOut, ChevronDown, NotebookPenIcon, FolderPlus, ChevronUp } from 'lucide-vue-next'

const showAddMenu = ref(false)
const router = useRouter()

const toggleAddMenu = () => {
  showAddMenu.value = !showAddMenu.value
}

const logout = () => {
  localStorage.removeItem('admin_logged_in')
  router.push('/admin/login')
}
</script>

<style scoped>
.case {
  display: flex;
  align-items: center;
  width: 100%;
  text-decoration: none;
  padding: 18px 25px;
  border-left: 3px solid transparent;
}

.case:hover {
  background: rgba(30, 30, 30, 0.08);
  border-left: 3px solid #dde2ff;
}

.active {
  background: rgba(30, 30, 30, 0.08);
  border-left: 3px solid #dde2ff;
}

.case:hover .option {
  color: #dde2ff;
}

.case:hover .sidebar-icon {
  opacity: 1;
}

.option {
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.2px;
  color: #a4a6b3;
  margin: 0;
  z-index: 3;
}

.sidebar-icon {
  opacity: 0.4;
  color: #a4a6b3;
}
</style>