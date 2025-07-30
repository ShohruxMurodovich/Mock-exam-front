<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Writing Section</h2>
    <div v-for="(task, index) in store.writingTasks" :key="task.id">
      <h3 class="text-lg font-medium">Task {{ task.taskType }}</h3>
      <p class="mb-2">{{ task.prompt }}</p>
      <textarea v-model="store.writingAnswers[index]" class="textarea"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTestStore } from '../store/testStore'

const store = useTestStore()
</script>
