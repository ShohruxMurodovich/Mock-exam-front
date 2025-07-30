// stores/testStore.ts
import { defineStore } from 'pinia'

export const useTestStore = defineStore('testStore', {
  state: () => ({
    listeningQuestions: [] as any[],
    readingQuestions: [] as any[],
    writingQuestions: {
      task1: { text: '', image: null },
      task2: ''
    }
  }),
  actions: {
    setListeningQuestions(questions: any[]) {
      this.listeningQuestions = questions
    },
    setReadingQuestions(questions: any[]) {
      this.readingQuestions = questions
    },
    setWritingQuestions(task1: any, task2: string) {
      this.writingQuestions.task1 = task1
      this.writingQuestions.task2 = task2
    }
  }
})



