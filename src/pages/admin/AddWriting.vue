<template>
  <div class="max-w-3xl mx-auto mt-10 p-6">
    <h2 class="text-xl font-semibold mb-6">Add Writing Questions</h2>

    <form @submit.prevent="saveQuestions" class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2" for="task1">Task 1</label>
        <textarea
          id="task1"
          v-model="task1"
          rows="4"
          class="w-full border rounded p-2"
          required
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2" for="task2">Task 2</label>
        <textarea
          id="task2"
          v-model="task2"
          rows="4"
          class="w-full border rounded p-2"
          required
        ></textarea>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Save Writing Tasks
      </button>
    </form>

    <div v-if="saved" class="mt-6 text-green-600 font-semibold">
      ✅ Writing tasks saved successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const task1 = ref<string>('')
const task2 = ref<string>('')
const saved = ref<boolean>(false)

function saveQuestions() {
  console.log('Saved:', {
    task1: task1.value,
    task2: task2.value,
  })

  saved.value = true
}
</script>
