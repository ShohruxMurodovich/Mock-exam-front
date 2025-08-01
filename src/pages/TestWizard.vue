<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-10">
    <div class="max-w-9xl mx-auto bg-white shadow-xl p-8 pb-0">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-800">IELTS Mock Test</h1>
        <div class="text-sm text-gray-700">
          Time left: <span class="font-semibold text-blue-600">{{ formattedTime }}</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full h-3 bg-blue-100 rounded-full mb-8">
        <div
          class="h-3 bg-blue-600 rounded-full transition-all duration-500"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <!-- Section -->
      <component
        :is="currentComponent"
        @next="goNext"
        @back="goBack"
        @submit="submitTest"
      />

      <!-- Completed message -->
      <div v-if="step === 3" class="text-center mt-10">
        <h2 class="text-2xl font-bold text-green-700">✅ Test Completed</h2>
        <p class="text-gray-600 mt-2">Thank you, {{ testStore.studentInfo.fullName }}!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTestStore } from '../store/testStore'

import ListeningTest from '../components/steps/ListeningTest.vue'
import ReadingTest from '../components/steps/ReadingTest.vue'
import WritingTest from '../components/steps/WritingTest.vue'
const testStore = useTestStore()

const step = ref(0)
const timeLeft = ref(0)
let timer: any = null

const sectionTimes = [30 * 60, 60 * 60, 60 * 60] // seconds per section

const progress = computed(() => (step.value / 3) * 100)

const currentComponent = computed(() => {
  if (step.value === 0) return ListeningTest
  if (step.value === 1) return ReadingTest
  if (step.value === 2) return WritingTest
  return null
})

const formattedTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

function startTimer() {
  clearInterval(timer)
  timeLeft.value = sectionTimes[step.value]
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      goNext()
    }
  }, 1000)
}

function goNext() {
  if (step.value < 2) {
    step.value++
    startTimer()
  } else {
    step.value = 3 // completed
    clearInterval(timer)
  }
}

function goBack() {
  if (step.value > 0) {
    step.value--
    startTimer()
  }
}

function submitTest() {
  clearInterval(timer)
  step.value = 3
}

onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>