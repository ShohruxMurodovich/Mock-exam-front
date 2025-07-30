<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">
    <div class="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FileText class="w-7 h-7 text-gray-600" /> Add Reading Questions
      </h2>

      <form @submit.prevent class="space-y-10">
        <!-- Sections -->
        <div
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          class="border border-gray-300 rounded-xl p-6 bg-gray-50"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <BookText class="w-5 h-5 text-green-600" /> Section {{ sectionIndex + 1 }}
            </h3>

            <button
              v-if="sections.length > 1"
              @click.prevent="removeSection(sectionIndex)"
              class="text-red-600 border border-red-300 hover:bg-red-100 px-3 py-1 rounded flex items-center transition"
            >
              <Trash2 class="w-4 h-4 mr-2" /> Remove Section
            </button>
          </div>

          <!-- Passage Text -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-600 mb-2">Reading Passage</label>
            <textarea
              v-model="section.passage"
              rows="6"
              class="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-600 mb-2">Upload Image (optional)</label>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                @click="triggerFileInput(sectionIndex)"
              >
                <Image class="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                :ref="el => setFileInputRef(el, sectionIndex)"
                @change="e => handleImageUpload(e, sectionIndex)"
              />
              <span class="text-sm text-gray-500" v-if="section.image">{{ section.image.name }}</span>
            </div>
          </div>

          <!-- Questions -->
          <div class="space-y-6">
            <div
              v-for="(q, qIndex) in section.questions"
              :key="qIndex"
              class="border border-gray-300 p-5 rounded-lg bg-white hover:shadow-sm transition-shadow"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-700">Question {{ qIndex + 1 }}</h4>
                <button
                  v-if="section.questions.length > 1"
                  @click.prevent="removeQuestion(sectionIndex, qIndex)"
                  class="text-red-600 hover:underline flex items-center text-sm"
                >
                  <Trash2 class="w-4 h-4 mr-1" /> Remove
                </button>
              </div>

              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-600 mb-1">Type</label>
                <select
                  v-model="q.type"
                  class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option v-for="type in questionTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-600 mb-1">Question Text</label>
                <textarea
                  v-model="q.text"
                  rows="2"
                  class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                ></textarea>
              </div>

              <!-- Options -->
              <div v-if="needsOptions(q.type)" class="mb-3">
                <label class="block text-sm font-medium text-gray-600 mb-1">Options</label>
                <div class="space-y-2">
                  <div
                    v-for="(opt, optIdx) in q.options"
                    :key="optIdx"
                    class="flex items-center gap-2"
                  >
                    <input
                      v-model="q.options[optIdx]"
                      class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                      type="button"
                      @click="removeOption(sectionIndex, qIndex, optIdx)"
                      :disabled="q.options.length <= 1"
                      class="text-gray-500 hover:text-red-500 transition"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  class="mt-2 inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                  @click="addOption(sectionIndex, qIndex)"
                >
                  <Plus class="w-4 h-4 mr-1" /> Add Option
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Correct Answer</label>
                <input
                  v-model="q.answer"
                  class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            <!-- Add Question Button -->
            <button
              type="button"
              class="mt-4 px-3 py-1 border border-blue-300 text-blue-500 rounded hover:bg-blue-100 flex items-center"
              @click="addQuestion(sectionIndex)"
            >
              <Plus class="w-4 h-4 mr-1" /> Add Question
            </button>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex justify-between mt-10">
          <button
            type="button"
            @click="addSection"
            class="bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 flex items-center"
          >
            <PlusCircle class="w-5 h-5 mr-1" /> Add Section
          </button>

          <button
            type="submit"
            @click="submitReading"
            class="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition flex items-center"
          >
            <Save class="w-5 h-5 mr-2" /> Save Questions
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useTestStore } from '../../store/testStore' // Import Pinia store

const testStore = useTestStore()

import {
  FileText,
  BookText,
  Plus,
  Trash2,
  X,
  Image,
  Save,
  PlusCircle
} from 'lucide-vue-next'

interface Question {
  type: string
  text: string
  options: string[]
  answer: string
}

interface Section {
  passage: string
  image: File | null
  questions: Question[]
}

const questionTypes = [
  'Multiple Choice',
  'Matching Headings',
  'True/False/Not Given',
  'Yes/No/Not Given',
  'Sentence Completion',
  'Summary Completion',
  'Note Completion',
  'Table Completion',
  'Diagram Label Completion',
  'Short Answer Questions',
  'Paragraph Matching'
]

const sections = ref<Section[]>([
  {
    passage: '',
    image: null,
    questions: [
      { type: 'Multiple Choice', text: '', options: [''], answer: '' }
    ]
  }
])

const fileInputs = ref<(HTMLInputElement | null)[]>([])

function setFileInputRef(el: Element | null, index: number) {
  if (el instanceof HTMLInputElement || el === null) {
    fileInputs.value[index] = el
  }
}

function triggerFileInput(index: number) {
  fileInputs.value[index]?.click()
}

function handleImageUpload(e: Event, sectionIndex: number) {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (file) {
    sections.value[sectionIndex].image = file
  }
}

function addSection() {
  sections.value.push({
    passage: '',
    image: null,
    questions: [{ type: 'Multiple Choice', text: '', options: [''], answer: '' }]
  })
}

function removeSection(index: number) {
  sections.value.splice(index, 1)
}

function addQuestion(sectionIndex: number) {
  sections.value[sectionIndex].questions.push({
    type: 'Multiple Choice',
    text: '',
    options: [''],
    answer: ''
  })
}

function removeQuestion(sectionIndex: number, qIndex: number) {
  sections.value[sectionIndex].questions.splice(qIndex, 1)
}

function addOption(sectionIndex: number, qIndex: number) {
  sections.value[sectionIndex].questions[qIndex].options.push('')
}

function removeOption(sectionIndex: number, qIndex: number, optIndex: number) {
  const options = sections.value[sectionIndex].questions[qIndex].options
  if (options.length > 1) options.splice(optIndex, 1)
}

function needsOptions(type: string) {
  return [
    'Multiple Choice',
    'Matching Headings',
    'Summary Completion',
    'Note Completion',
    'Table Completion',
    'Diagram Label Completion'
  ].includes(type)
}

function submitReading() {
  console.log('Submitting Reading questions:', sections.value)
  testStore.setReadingQuestions(sections.value)
  alert('Reading test saved!')
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
  animation: fade-in 0.6s ease-out both;
}
</style>
