// stores/testStore.ts
import { defineStore } from 'pinia'

export const useTestStore = defineStore('testStore', {
  state: () => ({
    listeningParts: [
      {
        partTitle: 'Part 1',
        audioUrl: '',
        questionGroups: [
          {
            sharedInstruction: 'Complete the form below.',
            questions: [
              {
                questionType: 'form',
                questionText: 'Name:',
                correctAnswer: 'John Smith',
                maxWords: 2,
                explanation: 'Basic name input',
                imageUrl: ''
              },
              {
                questionType: 'form',
                questionText: 'Phone number:',
                correctAnswer: '555-1234',
                maxWords: 1,
                explanation: 'Must include area code',
                imageUrl: ''
              }
            ]
          }
        ]
      }
      // Add up to 4 parts here
    ]
  }),

  actions: {
    setListeningParts(parts: any[]) {
      this.listeningParts = parts
    }
  }
})