import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStudentStore = defineStore('student', () => {
  const fullName = ref<string>('')
  const group = ref<string>('')

  return {
    fullName,
    group,
  }
})
