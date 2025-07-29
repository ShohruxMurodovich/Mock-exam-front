<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-semibold mb-4">Admin Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block font-medium">Username</label>
        <input v-model="username" type="text" class="w-full border p-2 rounded" />
      </div>
      <div class="mb-4">
        <label class="block font-medium">Password</label>
        <input v-model="password" type="password" class="w-full border p-2 rounded" />
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</button>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </form>
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
