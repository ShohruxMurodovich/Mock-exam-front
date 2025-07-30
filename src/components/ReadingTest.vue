<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Reading Section</h2>
    <div v-for="part in [1,2,3]" :key="part" class="mb-8">
      <h3 class="text-lg font-medium">Part {{ part }}</h3>
      <p class="bg-gray-100 p-3 rounded">Passage: {{ getPassage(part) }}</p>
      <div v-for="(q, index) in getQuestions(part)" :key="q.id" class="mt-2">
        <label>{{ q.questionText }}</label>
        <input v-model="store.readingAnswers[part - 1][index]" class="input" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTestStore } from '../store/testStore'

const store = useTestStore()

function getQuestions(part: number) {
  return store.readingQuestions.filter(q => q.part === part)
}
function getPassage(part: number) {
  return store.readingQuestions.find(q => q.part === part)?.passage
}
</script>

