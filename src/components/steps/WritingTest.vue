<template>
  <div class="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 animate-fade-in">
      <h2 class="text-3xl font-bold text-blue-800 mb-6">IELTS Writing Test</h2>

      <div class="mb-10">
        <h3 class="text-lg font-semibold text-blue-700 mb-2">Task 1</h3>
        <p class="text-sm text-gray-700 mb-3">
          The graph below shows the percentage of households with internet access from 1995 to 2020.
          Summarize the information by selecting and reporting the main features.
        </p>
        <textarea
          v-model="task1"
          rows="8"
          class="w-full border px-4 py-2 rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400"
          placeholder="Write your response for Task 1 here"
        />
      </div>

      <div class="mb-10">
        <h3 class="text-lg font-semibold text-blue-700 mb-2">Task 2</h3>
        <p class="text-sm text-gray-700 mb-3">
          Some believe that students should learn entrepreneurship in school. To what extent do you agree or disagree?
        </p>
        <textarea
          v-model="task2"
          rows="10"
          class="w-full border px-4 py-2 rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400"
          placeholder="Write your essay for Task 2 here"
        />
      </div>

      <div class="flex justify-between mt-6">
        <button @click="$emit('back')" class="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl">← Back</button>
        <button @click="$emit('submit')" class="bg-green-600 text-white px-8 py-2 rounded-xl hover:bg-green-700">Submit Test</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const task1 = ref('')
const task2 = ref('')
</script>