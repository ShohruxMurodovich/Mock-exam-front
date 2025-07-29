<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white text-center">
    <h1 class="text-2xl font-bold mb-6">Enter Your Details</h1>
    <form @submit.prevent="startTest" class="space-y-4">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Start Writing Test
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'


const router = useRouter()

function startTest(): void {
  router.push('/writing')
}
</script>
