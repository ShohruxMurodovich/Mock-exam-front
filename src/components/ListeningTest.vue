<template>
  <div>
    <h2 class="text-xl font-semibold">Listening Section</h2>
    <div v-for="part in [1,2,3,4]" :key="part" class="mb-6">
      <h3 class="text-lg font-medium">Part {{ part }}</h3>
      <audio :src="getAudio(part)" controls class="my-2"></audio>
      <div v-for="q in getQuestions(part)" :key="q.id" class="mb-3">
        <label>{{ q.questionText }}</label>
        <input v-model="store.listeningAnswers[q.id - 1]" class="input" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTestStore } from '../store/testStore'

const store = useTestStore()

function getQuestions(part: number) {
  return store.listeningQuestions.filter(q => q.part === part)
}
function getAudio(part: number) {
  return store.listeningQuestions.find(q => q.part === part)?.audioUrl
}
</script>
