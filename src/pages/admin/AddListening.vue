<template>
  <div class="min-h-screen py-10 px-6 bg-gradient-to-br from-gray-100 to-gray-200">
    <div class="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 animate-fade-in">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <BookHeadphones class="w-7 h-7 text-gray-600" /> Add IELTS Listening Test
      </h2>

      <div v-for="(part, pIndex) in parts" :key="pIndex" class="mb-10 border border-gray-300 rounded-xl p-6 bg-gray-50 hover:shadow-md transition-shadow duration-300">
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
          <label class="block text-sm font-medium text-gray-600 mb-1">Introductory Instruction (Optional):</label>
          <textarea v-model="part.instruction" rows="2" class="w-full border border-gray-300 p-2 rounded-md" placeholder="Write introduction for this part (e.g. You will hear a conversation between...)" />
        </div>

        <div v-for="(group, gIndex) in part.groups" :key="gIndex" class="border border-gray-200 rounded-md p-4 bg-white mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Group Instruction:</label>
              <textarea v-model="group.instruction" rows="2" class="w-full border border-gray-300 p-2 rounded-md" placeholder="E.g. Choose TWO letters A–E"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Explanation (optional):</label>
              <textarea v-model="group.explanation" rows="2" class="w-full border border-gray-300 p-2 rounded-md" placeholder="Explain how to answer..."></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-sm text-gray-600">Word Limit (optional)</label>
              <input type="number" min="1" v-model.number="group.wordLimit" class="w-full border border-gray-300 p-2 rounded-md" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Question Type:</label>
              <select v-model="group.type" class="w-full border border-gray-300 p-2 rounded-md">
                <option v-for="type in questionTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
              </select>
            </div>
          </div>

          <div v-for="(question, qIndex) in group.questions" :key="qIndex" class="border border-gray-300 rounded-md p-4 mb-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-sm font-semibold text-gray-700">Question {{ getGlobalQuestionNumber(pIndex, gIndex, qIndex) }}</h3>
              <button @click="removeQuestion(pIndex, gIndex, qIndex)" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>

            <label class="block text-sm text-gray-600 mb-1">Question Text:</label>
            <textarea v-model="question.text" rows="2" class="w-full border border-gray-300 p-2 rounded-md mb-3"></textarea>

            <div v-if="usesOptions(group.type)" class="mb-3">
              <label class="block text-sm font-medium text-gray-600 mb-1">Options:</label>
              <div v-for="(_, i) in question.options" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="question.options[i]" class="flex-1 border border-gray-300 p-2 rounded-md" />
                <button @click="removeOption(pIndex, gIndex, qIndex, i)" class="text-gray-500 hover:text-red-500">
                  <X class="w-4 h-4" />
                </button>
              </div>
              <button @click="addOption(pIndex, gIndex, qIndex)" class="text-blue-600 text-sm mt-1">+ Add Option</button>
            </div>

            <div class="mb-3">
              <label class="block text-sm text-gray-600 mb-1">Correct Answer:</label>
              <input v-model="question.answer" class="w-full border border-gray-300 p-2 rounded-md" />
            </div>

            <div v-if="['plan_map_labeling', 'diagram_label'].includes(group.type)" class="mb-4 mt-2">
              <label class="block text-sm font-medium text-gray-600 mb-2">Upload Diagram/Image:</label>
              <div class="flex items-center gap-4">
                <button type="button" @click="triggerImageUpload(pIndex, qIndex)" class="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded shadow">
                  <Upload class="w-4 h-4" />
                  <span>Choose Image</span>
                </button>

                <input type="file" accept="image/*" :ref="el => setImageRef(el, pIndex, qIndex)" class="hidden" @change="e => handleImageUpload(e, pIndex, gIndex, qIndex)" />

                <span v-if="question.diagramImageUrl" class="text-sm text-gray-600">Image selected</span>
              </div>

              <div v-if="question.diagramImageUrl" class="mt-4">
                <img :src="question.diagramImageUrl" alt="Uploaded Diagram" class="rounded-lg shadow-md border border-gray-200 max-h-48 object-contain" />
              </div>
            </div>
          </div>

          <button @click="addQuestion(pIndex, gIndex)" class="text-green-600 hover:text-green-800 text-sm">+ Add Question</button>
        </div>

        <button @click="addGroup(pIndex)" class="text-blue-600 hover:text-blue-800 text-sm">+ Add Group</button>
      </div>

      <div class="flex justify-between items-center mt-10">
        <button @click="preview = true" class="text-sm text-blue-600 hover:text-blue-800 transition underline font-medium">Preview Test</button>
        <button @click="submit" class="inline-flex items-center bg-gray-800 text-white px-5 py-3 rounded-lg hover:bg-gray-900 transition">
          <SaveIcon class="w-4 h-4 mr-2" /> Save Questions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Music, SaveIcon, X, BookHeadphones } from 'lucide-vue-next'
import { useTestStore } from '../../store/testStore'

const testStore = useTestStore()
const preview = ref(false)

const imageRefs = ref<Record<string, HTMLInputElement | null>>({})

function setImageRef(el: unknown, partIdx: number, questionIdx: number) {
  const inputEl = el instanceof HTMLInputElement ? el : null
  if (inputEl || el === null) {
    imageRefs.value[`${partIdx}-${questionIdx}`] = inputEl
  }
}

function triggerImageUpload(partIdx: number, questionIdx: number) {
  const refKey = `${partIdx}-${questionIdx}`
  imageRefs.value[refKey]?.click()
}

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
  text: string
  options: string[]
  answer: string
  diagramImageUrl?: string
}

interface QuestionGroup {
  instruction: string
  explanation?: string
  wordLimit?: number | null
  type: QuestionType
  questions: Question[]
}

interface Part {
  audioUrl: string | null
  instruction: string
  groups: QuestionGroup[]
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
    text: '',
    options: [''],
    answer: ''
  }
}

function createGroup(): QuestionGroup {
  return {
    instruction: '',
    explanation: '',
    wordLimit: null,
    type: 'multiple_choice',
    questions: [createQuestion()]
  }
}

const parts = ref<Part[]>([
  { audioUrl: null, instruction: '', groups: [createGroup()] },
  { audioUrl: null, instruction: '', groups: [createGroup()] },
  { audioUrl: null, instruction: '', groups: [createGroup()] },
  { audioUrl: null, instruction: '', groups: [createGroup()] }
])

function addGroup(pIndex: number) {
  parts.value[pIndex].groups.push(createGroup())
}

function addQuestion(pIndex: number, gIndex: number) {
  parts.value[pIndex].groups[gIndex].questions.push(createQuestion())
}

function removeQuestion(pIndex: number, gIndex: number, qIndex: number) {
  const questions = parts.value[pIndex].groups[gIndex].questions
  if (questions.length > 1) {
    questions.splice(qIndex, 1)
  }
}

function addOption(p: number, g: number, q: number) {
  parts.value[p].groups[g].questions[q].options.push('')
}

function removeOption(p: number, g: number, q: number, i: number) {
  const opts = parts.value[p].groups[g].questions[q].options
  if (opts.length > 1) opts.splice(i, 1)
}

function usesOptions(type: string) {
  return ['multiple_choice', 'matching', 'pick_from_list'].includes(type)
}

function getStartQuestionNumber(partIndex: number): number {
  return partIndex * 10 + 1
}

function getEndQuestionNumber(partIndex: number): number {
  return partIndex * 10 + 10
}

function getGlobalQuestionNumber(partIndex: number, groupIndex: number, qIndex: number): number {
  let count = 0
  for (let i = 0; i < partIndex; i++) {
    for (const g of parts.value[i].groups) {
      count += g.questions.length
    }
  }
  for (let j = 0; j < groupIndex; j++) {
    count += parts.value[partIndex].groups[j].questions.length
  }
  return count + qIndex + 1
}

function handleAudioUpload(e: Event, pIndex: number) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    parts.value[pIndex].audioUrl = URL.createObjectURL(file)
  }
}

function handleImageUpload(e: Event, p: number, g: number, q: number) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    parts.value[p].groups[g].questions[q].diagramImageUrl = URL.createObjectURL(file)
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