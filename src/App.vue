<template>
  <div class="font-sans text-gray-900">
    <!-- <header class="border-b pb-4">
      <h1 class="text-2xl font-bold mb-2 text-center">IELTS Mock Exam</h1>
      <nav class="flex justify-center gap-4">
        <RouterLink
          to="/"
          class="text-blue-600 hover:underline"
          active-class="font-bold underline"
        >
          Home
        </RouterLink>
        
        <RouterLink
          to="/admin"
          class="text-blue-600 hover:underline"
          active-class="font-bold underline"
        >
          Admin
        </RouterLink>
      </nav>
    </header> -->

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
