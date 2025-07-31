<template>
  <div class="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 animate-fade-in">
      <h2 class="text-3xl font-bold text-blue-800 mb-6">IELTS Reading Test</h2>

      <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded shadow-sm">
        <h3 class="font-semibold text-blue-700 mb-2">Passage</h3>
        <p class="text-gray-700 text-sm whitespace-pre-line">
          The invention of the printing press by Gutenberg in the 15th century revolutionized communication...
        </p>
      </div>

      <div v-for="(group, gIndex) in readingGroups" :key="gIndex" class="mb-10">
        <p class="text-sm text-blue-600 font-medium mb-3">{{ group.instruction }}</p>

        <div
          v-for="(q, qIndex) in group.questions"
          :key="q.id"
          class="mb-5 bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Q{{ qIndex + 1 }}. {{ q.label }}
          </label>
          <input
            v-model="q.answer"
            type="text"
            class="w-full px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Type your answer"
          />
        </div>
      </div>

      <div class="flex justify-between mt-6">
        <button @click="$emit('back')" class="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl">← Back</button>
        <button @click="$emit('next')" class="bg-blue-600 text-white px-8 py-2 rounded-xl hover:bg-blue-700">Next →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const readingGroups = ref([
  {
    instruction: 'Complete the sentences below using NO MORE THAN THREE WORDS from the passage.',
    questions: [
      { id: 'R1', label: 'Gutenberg’s invention led to the mass production of ______.', answer: '' },
      { id: 'R2', label: 'The printing press helped improve ______ levels.', answer: '' },
    ],
  },
])
</script>