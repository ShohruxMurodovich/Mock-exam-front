<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Add Listening Questions</h1>

    <div v-for="(question, index) in questions" :key="index" class="mb-8 border p-4 rounded-lg shadow-sm bg-white">
      <h2 class="font-semibold mb-4">Question {{ index + 1 }} (Part {{ getPart(index) }})</h2>

      <!-- Question Type -->
      <label class="block mb-2 text-sm font-medium">Question Type:</label>
      <select
        v-model="question.type"
        class="w-full border px-3 py-2 mb-4 rounded"
      >
        <option value="multiple-choice">Multiple Choice</option>
        <option value="gap-fill">Gap Fill</option>
        <option value="map-labeling">Map Labeling</option>
        <option value="matching">Matching</option>
        <option value="short-answer">Short Answer</option>
      </select>

      <!-- Question Text -->
      <label class="block mb-2 text-sm font-medium">Question Text:</label>
      <textarea
        v-model="question.text"
        class="w-full border px-3 py-2 mb-4 rounded"
        rows="3"
        placeholder="Enter question text..."
      ></textarea>

      <!-- Conditional Inputs -->
      <div v-if="question.type === 'multiple-choice'">
        <label class="block mb-2 text-sm font-medium">Options:</label>
        <div v-for="(option, optIndex) in question.options" :key="optIndex" class="flex gap-2 mb-2">
          <input
            v-model="question.options[optIndex]"
            class="w-full border px-3 py-2 rounded"
            :placeholder="`Option ${optIndex + 1}`"
          />
          <button @click="removeOption(index, optIndex)" class="text-red-500"><Trash class="sidebar-icon w-5 h-5 mr-4" /></button>
        </div>
        <button @click="addOption(index)" class="text-blue-600 text-sm">+ Add Option</button>
      </div>

      <!-- Answer -->
      <label class="block mt-4 mb-2 text-sm font-medium">Answer:</label>
      <input
        v-model="question.answer"
        class="w-full border px-3 py-2 rounded"
        placeholder="Correct answer"
      />
    </div>

    <button
      @click="submit"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
    >
      Save All Questions
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Trash } from 'lucide-vue-next'


interface ListeningQuestion {
  type: string
  text: string
  options: string[]
  answer: string
}

const questions = ref<ListeningQuestion[]>(
  Array.from({ length: 40 }, () => ({
    type: 'multiple-choice',
    text: '',
    options: ['', '', '', ''],
    answer: ''
  }))
)

const getPart = (index: number) => {
  if (index < 10) return 1
  if (index < 20) return 2
  if (index < 30) return 3
  return 4
}

const addOption = (qIndex: number) => {
  questions.value[qIndex].options.push('')
}

const removeOption = (qIndex: number, optIndex: number) => {
  const options = questions.value[qIndex].options
  if (options.length > 1) {
    options.splice(optIndex, 1)
  }
}

const submit = () => {
  console.log('Submitted Questions:', questions.value)
  // You can send questions.value to the backend here
}
</script>

<style scoped>
/* Optional custom styles */
</style>
