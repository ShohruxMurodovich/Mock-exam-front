<template>
  <div class="min-h-[100vh] flex flex-col bg-[#f4f7fc] text-gray-800">
    <!-- Main writing content -->
    <div class="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <h2 class="text-3xl font-semibold text-blue-800 mb-8 text-center">
        IELTS Writing Test
      </h2>

      <!-- TASK VIEW -->
      <div
        v-if="currentTask === 1"
        class="grid md:grid-cols-2 gap-8 min-h-[calc(100vh-220px)]"
      >
        <!-- Question -->
        <div class="flex flex-col">
          <h3 class="text-xl font-semibold text-blue-700 mb-4">Writing Task 1</h3>
          <p class="whitespace-pre-line leading-relaxed flex-grow">{{ task1.text }}</p>
          <img
            v-if="task1.imageUrl"
            :src="task1.imageUrl"
            class="mt-6 rounded-xl shadow-sm border border-blue-100"
            alt="Task 1 Image"
          />
        </div>

        <!-- Answer -->
        <div class="flex flex-col">
          <textarea
            v-model="task1Answer"
            @input="updateWordCount1"
            class="flex-grow p-4 text-base rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-none shadow-sm min-h-[100%]"
            placeholder="Write your response here (at least 150 words)"
          />
          <p class="text-right text-sm text-gray-500 mt-2">
            Word count: <strong>{{ wordCount1 }}</strong>
          </p>
        </div>
      </div>

      <div
        v-if="currentTask === 2"
        class="grid md:grid-cols-2 gap-8 mb-6 min-h-[calc(100vh-220px)]"
      >
        <!-- Question -->
        <div class="flex flex-col">
          <h3 class="text-xl font-semibold text-blue-700 mb-4">Writing Task 2</h3>
          <p class="whitespace-pre-line leading-relaxed flex-grow">{{ task2.text }}</p>
        </div>

        <!-- Answer -->
        <div class="flex flex-col">
          <textarea
            v-model="task2Answer"
            @input="updateWordCount2"
            class="flex-grow p-4 text-base rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-none shadow-sm min-h-[100%]"
            placeholder="Write your essay here (at least 250 words)"
          />
          <p class="text-right text-sm text-gray-500 mt-2">
            Word count: <strong>{{ wordCount2 }}</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom -->
    <div
      class="sticky bottom-0 w-full bg-white border-t border-blue-100 px-4 md:px-8 py-4 shadow-md z-10"
    >
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex gap-3">
          <button
            class="px-5 py-2 rounded-lg border text-sm font-medium transition-all"
            :class="currentTask === 1 ? activeBtnClass : inactiveBtnClass"
            @click="currentTask = 1"
          >
            Task 1
          </button>
          <button
            class="px-5 py-2 rounded-lg border text-sm font-medium transition-all"
            :class="currentTask === 2 ? activeBtnClass : inactiveBtnClass"
            @click="currentTask = 2"
          >
            Task 2
          </button>
        </div>

        <button
          @click="submitWriting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          Submit Writing
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTestStore } from '../../store/testStore'

const testStore = useTestStore()

const task1 = testStore.writingQuestions.task1
const task2 = testStore.writingQuestions.task2

const task1Answer = ref('')
const task2Answer = ref('')

const wordCount1 = ref(0)
const wordCount2 = ref(0)

const currentTask = ref<1 | 2>(1)

const activeBtnClass = 'bg-blue-600 text-white border-blue-600'
const inactiveBtnClass = 'text-blue-600 hover:bg-blue-100 border-blue-300'

function updateWordCount1() {
  wordCount1.value = countWords(task1Answer.value)
}
function updateWordCount2() {
  wordCount2.value = countWords(task2Answer.value)
}
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function submitWriting() {
  if (wordCount1.value < 150 || wordCount2.value < 250) {
    alert('Please write at least 150 words for Task 1 and 250 for Task 2.')
    return
  }

  alert('✅ Writing test submitted successfully!')
  console.log({
    task1Answer: task1Answer.value,
    task2Answer: task2Answer.value,
  })
}
</script>