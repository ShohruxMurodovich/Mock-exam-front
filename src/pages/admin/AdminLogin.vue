<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-all duration-300 font-medium"
        >
          Login
        </button>

        <p v-if="error" class="text-red-500 text-sm mt-2 text-center animate-shake">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function login() {
  if (username.value === 'admin' && password.value === '1234') {
    localStorage.setItem('isAdmin', 'true')
    router.push('/admin')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>