<template>
  <div class="space-y-8">
    <StudentInfo v-if="step === 1" @next="step++" />
    <ListeningTest v-if="step === 2" @next="step++" />
    <ReadingTest v-if="step === 3" @next="step++" />
    <WritingTest v-if="step === 4" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StudentInfo from '../components/StudentInfo.vue'
import ListeningTest from '../components/ListeningTest.vue'
import ReadingTest from '../components/ReadingTest.vue'
import WritingTest from '../components/WritingTest.vue'
const step = ref(1)

function handleSubmit() {
  alert('Test submitted successfully!')
  // Could send Pinia store data to API here
  step.value = 1 // Restart or redirect
}
</script>