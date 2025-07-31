<template>
  <div class="min-h-screen py-10 px-6 bg-gradient-to-br from-gray-100 to-gray-200">
    <div class="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 animate-fade-in">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <BookHeadphones class="w-7 h-7 text-gray-600" /> Add Listening Questions
      </h2>

      <div
        v-for="(part, pIndex) in parts"
        :key="pIndex"
        class="mb-10 border border-gray-300 rounded-xl p-6 bg-gray-50 hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2 text-xl font-semibold text-gray-700">
            <Music class="w-6 h-6 text-gray-500" />
            <span>Part {{ pIndex + 1 }} (Q{{ getStartQuestionNumber(pIndex) }}–{{ getEndQuestionNumber(pIndex) }})</span>
          </div>

          <label class="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition">
            <Upload class="w-5 h-5" />
            <span>Upload Audio</span>
            <input type="file" accept="audio/*" @change="e => handleAudioUpload(e, pIndex)" class="hidden" />
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Instructions:</label>
          <textarea v-model="part.instruction" rows="2"
            class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
        </div>

        <div class="space-y-6">
          <div
            v-for="(question, qIndex) in part.questions"
            :key="qIndex"
            class="border border-gray-300 p-5 rounded-lg bg-white"
          >
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2 font-semibold text-gray-700">
                <CircleHelp class="w-4 h-4 text-indigo-500" />
                <h3>Question {{ getGlobalQuestionNumber(pIndex, qIndex) }}</h3>
              </div>
              <button
                @click="removeQuestion(pIndex, qIndex)"
                v-if="part.questions.length > 1"
                class="text-red-500 hover:text-red-700 transition"
              >
                <Trash class="w-4 h-4" />
              </button>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Type:</label>
              <select v-model="question.type"
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400">
                <option v-for="type in questionTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Question Text:</label>
              <textarea v-model="question.text" rows="3"
                class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"></textarea>
            </div>

            <div v-if="['plan_map_labeling', 'diagram_label'].includes(question.type)" class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Upload Image:</label>
              <input type="file" accept="image/*" @change="e => handleImageUpload(e, pIndex, qIndex)" />
              <div v-if="question.diagramImageUrl" class="mt-2">
                <img :src="question.diagramImageUrl" alt="Diagram" class="max-h-40 rounded shadow" />
              </div>
            </div>

            <div v-if="usesOptions(question.type)" class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Options:</label>
              <div v-for="(opt, i) in question.options" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="question.options[i]"
                  class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <button @click="removeOption(pIndex, qIndex, i)" :disabled="question.options.length <= 1"
                  class="text-gray-500 hover:text-red-500 transition">
                  <X class="w-4 h-4" />
                </button>
              </div>
              <button @click="addOption(pIndex, qIndex)"
                class="mt-1 inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition">
                <Plus class="w-4 h-4 mr-1" /> Add Option
              </button>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Correct Answer:</label>
              <div v-if="allowsMultipleAnswers(question.type)">
                <div v-for="(ans, i) in question.answerList" :key="i" class="flex gap-2 mb-2">
                  <input v-model="question.answerList[i]"
                    class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
                  <button @click="question.answerList.splice(i, 1)" class="text-red-500">
                    <X class="w-4 h-4" />
                  </button>
                </div>
                <button @click="question.answerList.push('')"
                  class="text-sm text-green-600 hover:text-green-800 transition">
                  + Add Another Answer
                </button>
              </div>
              <div v-else>
                <input v-model="question.answer"
                  class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600">Max Word Limit</label>
                <input type="number" min="1" v-model.number="question.validation.wordLimit"
                  class="w-full border border-gray-300 p-2 rounded-md" />
              </div>
              <div class="flex items-center gap-2 mt-6">
                <input type="checkbox" v-model="question.validation.numberOnly" />
                <label class="text-sm text-gray-600">Accept Numbers Only</label>
              </div>
            </div>
          </div>
        </div>

        <button @click="addQuestion(pIndex)" :disabled="part.questions.length >= 10"
          class="mt-5 text-green-600 hover:text-green-800 transition font-medium">
          + Add Question
        </button>
      </div>

      <div class="flex justify-between items-center mt-10">
        <button @click="preview = true"
          class="text-sm text-blue-600 hover:text-blue-800 transition underline font-medium">
          Preview Test
        </button>
        <button @click="submit"
          class="inline-flex items-center bg-gray-800 text-white px-5 py-3 rounded-lg hover:bg-gray-900 transition">
          <SaveIcon class="w-4 h-4 mr-2" /> Save Questions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Trash, Upload, Music, CircleHelp, SaveIcon, Plus, X, BookHeadphones } from 'lucide-vue-next'
import { useTestStore } from '../../store/testStore'


function getStartQuestionNumber(partIndex: number): number {
  return partIndex * 10 + 1
}
function getEndQuestionNumber(partIndex: number): number {
  return partIndex * 10 + 10
}
function getGlobalQuestionNumber(partIndex: number, qIndex: number): number {
  return partIndex * 10 + qIndex + 1
}

const testStore = useTestStore()
const preview = ref(false)

type QuestionType =
  | 'multiple_choice'
  | 'matching'
  | 'plan_map_labeling'
  | 'form_note_table'
  | 'summary_completion'
  | 'sentence_completion'
  | 'short_answer'
  | 'pick_from_list'
  | 'flow_chart_completion'
  | 'diagram_label'

interface Question {
  type: QuestionType
  text: string
  options: string[]
  answer: string
  answerList: string[]
  validation: {
    wordLimit: number | null
    numberOnly: boolean
  }
  diagramImageUrl?: string
}

interface Part {
  audioUrl: string | null
  instruction: string
  questions: Question[]
}

const questionTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'matching', label: 'Matching' },
  { value: 'plan_map_labeling', label: 'Plan/Map/Diagram Labeling' },
  { value: 'form_note_table', label: 'Form/Note/Table Completion' },
  { value: 'summary_completion', label: 'Summary Completion' },
  { value: 'sentence_completion', label: 'Sentence Completion' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'pick_from_list', label: 'Pick From List' },
  { value: 'flow_chart_completion', label: 'Flow-Chart Completion' },
  { value: 'diagram_label', label: 'Diagram Label' }
]

function createQuestion(): Question {
  return {
    type: 'multiple_choice',
    text: '',
    options: [''],
    answer: '',
    answerList: [''],
    validation: { wordLimit: null, numberOnly: false }
  }
}

const parts = ref<Part[]>([
  { audioUrl: null, instruction: '', questions: [createQuestion()] },
  { audioUrl: null, instruction: '', questions: [createQuestion()] },
  { audioUrl: null, instruction: '', questions: [createQuestion()] },
  { audioUrl: null, instruction: '', questions: [createQuestion()] }
])

function addQuestion(p: number) {
  if (parts.value[p].questions.length < 10) {
    parts.value[p].questions.push(createQuestion())
  }
}
function removeQuestion(p: number, q: number) {
  if (parts.value[p].questions.length > 1) {
    parts.value[p].questions.splice(q, 1)
  }
}
function addOption(p: number, q: number) {
  parts.value[p].questions[q].options.push('')
}
function removeOption(p: number, q: number, i: number) {
  const opts = parts.value[p].questions[q].options
  if (opts.length > 1) opts.splice(i, 1)
}
function usesOptions(type: string) {
  return ['multiple_choice', 'matching', 'pick_from_list'].includes(type)
}
function allowsMultipleAnswers(type: string) {
  return ['pick_from_list', 'matching'].includes(type)
}

function handleAudioUpload(e: Event, pIndex: number) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    parts.value[pIndex].audioUrl = URL.createObjectURL(file)
  }
}
function handleImageUpload(e: Event, p: number, q: number) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    parts.value[p].questions[q].diagramImageUrl = URL.createObjectURL(file)
  }
}
function submit() {
  console.log('Submitting test to Pinia:', parts.value)
  testStore.setListeningQuestions(parts.value)
  alert('Listening test saved!')
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out both;
}
</style>