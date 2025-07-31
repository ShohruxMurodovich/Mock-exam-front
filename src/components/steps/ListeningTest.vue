<template>
  <div class="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 animate-fade-in">
      <h2 class="text-3xl font-bold text-blue-800 mb-6">IELTS Listening Test</h2>

      <audio controls class="w-full mb-6">
        <source src="" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <div v-for="(group, gIndex) in listeningGroups" :key="gIndex" class="mb-10">
        <p class="text-blue-600 font-semibold mb-3 text-sm">
          {{ group.instruction }}
        </p>

        <div
          v-for="(q, qIndex) in group.questions"
          :key="q.id"
          class="mb-5 bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Q{{ qIndex + 1 }}. {{ q.label }}
          </label>
          <input
            v-model="q.answer"
            type="text"
            class="w-full px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Write your answer"
          />
        </div>
      </div>

      <div class="text-right mt-6">
        <button
          @click="$emit('next')"
          class="bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Next Section →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const listeningGroups = ref([
  {
    instruction: 'Complete the form. Use NO MORE THAN TWO WORDS AND/OR A NUMBER.',
    questions: [
      { id: 'L1', label: 'Full name of applicant', answer: '' },
      { id: 'L2', label: 'Contact phone number', answer: '' },
    ],
  },
  {
    instruction: 'Choose the correct letter, A, B, or C.',
    questions: [
      { id: 'L3', label: 'What kind of accommodation is preferred?', answer: '' },
    ],
  },
])
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}
</style>