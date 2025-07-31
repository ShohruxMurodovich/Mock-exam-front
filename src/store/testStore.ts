import { defineStore } from 'pinia'

interface WritingTask1 {
  text: string
  type: string
  image: File | null
}

interface WritingTask2 {
  text: string
  type: string
}

interface StudentInfo {
  fullName: string
  group: string
}

export const useTestStore = defineStore('testStore', {
  state: () => ({
    studentInfo: {
      fullName: '',
      group: '',
    } as StudentInfo,

    listeningQuestions: [] as any[],
    readingQuestions: [] as any[],
    writingQuestions: {
      task1: {
        text: '',
        type: '',
        image: null,
      } as WritingTask1,
      task2: {
        text: '',
        type: '',
      } as WritingTask2,
    },
  }),
  actions: {
    setStudentInfo(fullName: string, group: string) {
      this.studentInfo.fullName = fullName
      this.studentInfo.group = group
    },
    setListeningQuestions(questions: any[]) {
      this.listeningQuestions = questions
    },
    setReadingQuestions(questions: any[]) {
      this.readingQuestions = questions
    },
    setWritingQuestions(task1: WritingTask1, task2: WritingTask2) {
      this.writingQuestions.task1 = task1
      this.writingQuestions.task2 = task2
    },
  },
})