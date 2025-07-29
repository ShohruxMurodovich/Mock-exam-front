<template>
  <div class="p-6 mx-auto">
    <h1 class="text-2xl font-bold mb-6">Create IELTS Listening Test</h1>

    <div
      v-for="(part, pIndex) in parts"
      :key="pIndex"
      class="mb-10 border rounded p-4 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2 text-xl font-semibold">
          <Music class="w-6 h-6 " />
          <span>Part {{ pIndex + 1 }}</span>
        </div>
        <label class="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition">
          <Upload class="w-5 h-5" />
          <span>Upload Audio</span>
          <input type="file" accept="audio/*" @change="e => handleAudioUpload(e, pIndex)" class="hidden" />
        </label>
      </div>

      <div class="space-y-6">
        <div
          v-for="(question, qIndex) in part.questions"
          :key="qIndex"
          class="border p-4 rounded bg-gray-50"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-2 font-semibold">
              <CircleHelp class="w-4 h-4 text-indigo-500" />
              <h3>Question {{ pIndex * 10 + qIndex + 1 }}</h3>
            </div>
            <button @click="removeQuestion(pIndex, qIndex)" v-if="part.questions.length > 1" class="text-red-500 hover:text-red-700 transition">
              <Trash class="w-4 h-4" />
            </button>
          </div>

          <label class="block mb-1 text-sm font-medium">Question Type:</label>
          <select v-model="question.type" class="border p-1 w-full mb-3">
            <option v-for="type in questionTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>

          <label class="block mb-1 text-sm font-medium">Question Text:</label>
          <textarea
            v-model="question.text"
            class="border w-full p-2 mb-3 focus:outline-none focus:border-[#AEB2C9] transition-all"
          ></textarea>

          <!-- Options (if applicable) -->
          <div v-if="usesOptions(question.type)">
            <label class="block mb-1 text-sm font-medium">Options:</label>
            <div v-for="(opt, i) in question.options" :key="i" class="flex items-center mb-2">
              <input
                v-model="question.options[i]"
                class="border p-1 w-full mr-2 focus:outline-none focus:border-[#AEB2C9] transition"
              />
              <button
                @click="removeOption(pIndex, qIndex, i)"
                :disabled="question.options.length <= 1"
                class="text-red-500 hover:text-red-700 transition"
              >
                <Trash class="w-5 h-5" />
              </button>
            </div>
            <button @click="addOption(pIndex, qIndex)" class="text-white rounded px-2 py-1 bg-blue-600 hover:bg-blue-700 transition">
                <Plus class="w-5 h-5"/>
            </button>
          </div>

          <!-- Answer -->
          <label class="block mt-3 mb-1 text-sm font-medium">Correct Answer:</label>
          <input
            v-model="question.answer"
            class="border p-1 w-full focus:outline-none focus:border-[#AEB2C9] transition"
          />
        </div>
      </div>

      <button
        @click="addQuestion(pIndex)"
        :disabled="part.questions.length >= 10"
        class="mt-4 text-green-600 hover:text-green-800 transition"
      >
        + Add Question
      </button>
    </div>

    <div class="text-right">
      <button @click="submit" class="flex items-center bg-[#363740] text-white px-4 py-2 rounded hover:bg-[#323c46] transition">
        <SaveIcon class="w-4 h-4 mr-2" />
        Submit Test
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Trash, Upload, Music, CircleHelp, SaveIcon, Plus } from 'lucide-vue-next'

// Types

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
}

interface Part {
  audio: File | null
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

const parts = ref<Part[]>([
  { audio: null, questions: [createQuestion()] },
  { audio: null, questions: [createQuestion()] },
  { audio: null, questions: [createQuestion()] },
  { audio: null, questions: [createQuestion()] }
])

function createQuestion(): Question {
  return {
    type: 'multiple_choice',
    text: '',
    options: [''],
    answer: ''
  }
}

function addQuestion(partIndex: number) {
  if (parts.value[partIndex].questions.length < 10) {
    parts.value[partIndex].questions.push(createQuestion())
  }
}

function removeQuestion(partIndex: number, questionIndex: number) {
  if (parts.value[partIndex].questions.length > 1) {
    parts.value[partIndex].questions.splice(questionIndex, 1)
  }
}

function addOption(partIndex: number, qIndex: number) {
  parts.value[partIndex].questions[qIndex].options.push('')
}

function removeOption(partIndex: number, qIndex: number, optIndex: number) {
  const options = parts.value[partIndex].questions[qIndex].options
  if (options.length > 1) {
    options.splice(optIndex, 1)
  }
}

function usesOptions(type: string) {
  return ['multiple_choice', 'matching', 'pick_from_list'].includes(type)
}

function handleAudioUpload(e: Event, partIndex: number) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    parts.value[partIndex].audio = file
  }
}

function submit() {
  console.log('Submitting test:', parts.value)
  alert('Test structure saved (check console).')
}
</script>

<style scoped>
input,
textarea,
select {
  border-radius: 4px;
  transition: border-color 0.3s ease;
}
</style>
