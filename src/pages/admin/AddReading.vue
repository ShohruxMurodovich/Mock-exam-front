<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4">
    <div class="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileText class="w-7 h-7 text-gray-600" /> Add IELTS Reading Test
        </h2>
        <button @click="togglePreview" class="text-blue-600 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50">
          <Eye class="w-5 h-5 inline mr-1" /> {{ showPreview ? 'Hide Preview' : 'Preview Test' }}
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent v-if="!showPreview" class="space-y-8">
        <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="bg-gray-50 border border-gray-300 rounded-xl p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <BookText class="w-5 h-5 text-green-600" /> Section {{ sectionIndex + 1 }}
            </h3>
            <button v-if="sections.length > 1" @click.prevent="removeSection(sectionIndex)" class="text-red-600 hover:underline text-sm flex items-center">
              <Trash2 class="w-4 h-4 mr-1" /> Remove
            </button>
          </div>

          <!-- Passage -->
          <label class="block text-sm font-medium text-gray-600 mb-1">Reading Passage</label>
          <textarea v-model="section.passage" rows="5" class="w-full border border-gray-300 rounded-md p-3 mb-4" placeholder="Enter the reading passage..."></textarea>

          <!-- Image Upload -->
          <label class="block text-sm font-medium text-gray-600 mb-1">Upload Image (optional)</label>
          <div class="flex items-center gap-3 mb-6">
            <button type="button" @click="triggerFileInput(sectionIndex)" class="bg-gray-200 hover:bg-gray-300 p-2 rounded">
              <Image class="w-5 h-5 text-gray-600" />
            </button>
            <input type="file" accept="image/*" class="hidden" :ref="el => setFileInputRef(el, sectionIndex)" @change="e => handleImageUpload(e, sectionIndex)" />
            <span class="text-sm text-gray-500" v-if="section.image">{{ section.image.name }}</span>
          </div>

          <!-- Question Groups -->
          <div v-for="(group, groupIndex) in section.groups" :key="groupIndex" class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <label class="block text-sm font-medium text-gray-600 mb-1">Group Instruction (optional)</label>
            <input v-model="group.instruction" class="w-full border border-gray-300 rounded-md p-2 mb-4" placeholder="Instruction for this question group..." />

            <!-- Questions -->
            <div v-for="(q, qIndex) in group.questions" :key="qIndex" class="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-700">Question {{ getGlobalQuestionNumber(sectionIndex, groupIndex, qIndex) }}</h4>
                <button @click.prevent="removeQuestion(sectionIndex, groupIndex, qIndex)" class="text-red-500 text-sm hover:underline">
                  <Trash2 class="w-4 h-4 inline mr-1" /> Remove
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm">Type</label>
                  <select v-model="q.type" class="w-full border rounded p-2">
                    <option v-for="type in questionTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm">Word Limit (optional)</label>
                  <input type="number" min="1" v-model.number="q.wordLimit" class="w-full border rounded p-2" />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm">Question Text</label>
                <textarea v-model="q.text" rows="2" class="w-full border rounded p-2"></textarea>
              </div>

              <div v-if="needsOptions(q.type)" class="mt-4">
                <label class="block text-sm">Options</label>
                <div class="space-y-2">
                  <div v-for="(_, optIdx) in q.options" :key="optIdx" class="flex gap-2">
                    <input v-model="q.options[optIdx]" class="flex-1 border rounded p-2" />
                    <button @click="removeOption(sectionIndex, groupIndex, qIndex, optIdx)" class="text-red-500 text-lg">&times;</button>
                  </div>
                </div>
                <button @click="addOption(sectionIndex, groupIndex, qIndex)" class="mt-2 text-sm text-blue-500">+ Add Option</button>
              </div>

              <div class="mt-4">
                <label class="block text-sm">Correct Answer</label>
                <input v-model="q.answer" class="w-full border rounded p-2" />
              </div>

              <div class="mt-4">
                <label class="block text-sm">Explanation (optional)</label>
                <textarea v-model="q.explanation" rows="2" class="w-full border rounded p-2"></textarea>
              </div>
            </div>

            <button @click="addQuestion(sectionIndex, groupIndex)" class="text-blue-600 hover:underline text-sm">+ Add Question</button>
          </div>

          <button @click="addGroup(sectionIndex)" class="mt-2 text-green-600 hover:underline text-sm">+ Add Group</button>
        </div>

        <!-- Controls -->
        <div class="flex justify-between mt-10">
          <button @click="addSection" class="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200">
            <PlusCircle class="w-5 h-5 inline mr-2" /> Add Section
          </button>
          <button @click="submitReading" class="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900">
            <Save class="w-5 h-5 inline mr-2" /> Save Test
          </button>
        </div>
      </form>

      <!-- Preview -->
      <div v-else class="bg-white border rounded p-6">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">Reading Test Preview</h3>
        <div v-for="(section, sIdx) in sections" :key="sIdx" class="mb-10">
          <p class="mb-4 whitespace-pre-wrap text-gray-700">{{ section.passage }}</p>
          <div v-if="section.image">
            <img :src="getSectionImageUrl(section)" class="mb-4 rounded max-w-full" />
          </div>
          <div v-for="(group, gIdx) in section.groups" :key="gIdx" class="mb-6">
            <p class="italic text-sm text-gray-600 mb-2" v-if="group.instruction">{{ group.instruction }}</p>
            <div v-for="(q, qIdx) in group.questions" :key="qIdx" class="mb-4">
              <p class="font-medium">Q{{ getGlobalQuestionNumber(sIdx, gIdx, qIdx) }}. {{ q.text }}</p>
              <ul v-if="q.options.length" class="list-disc pl-5">
                <li v-for="(opt, oIdx) in q.options" :key="oIdx">{{ opt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- script and styles remain unchanged -->

<script setup lang="ts">
import { ref } from 'vue'
import { useTestStore } from '../../store/testStore'
import {
  FileText,
  BookText,
  Trash2,
  Image,
  Save,
  Eye,
  PlusCircle
} from 'lucide-vue-next'

const testStore = useTestStore()

interface Question {
  type: string
  text: string
  options: string[]
  answer: string
  explanation?: string
  wordLimit?: number
}

interface QuestionGroup {
  instruction: string
  questions: Question[]
}

interface Section {
  passage: string
  image: File | null
  groups: QuestionGroup[]
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


const getSectionImageUrl = (section: Section): string => {
  return section.image instanceof File
    ? URL.createObjectURL(section.image)
    : typeof section.image === 'string'
      ? section.image
      : '';
};

const sections = ref<Section[]>([
  {
    passage: '',
    image: null,
    groups: [
      {
        instruction: '',
        questions: [
          { type: 'Multiple Choice', text: '', options: [''], answer: '' }
        ]
      }
    ]
  }
])

const showPreview = ref(false)
const fileInputs = ref<(HTMLInputElement | null)[]>([])

function togglePreview() {
  showPreview.value = !showPreview.value
}

function setFileInputRef(el: HTMLInputElement | null | unknown, index: number) {
  if (el instanceof HTMLInputElement || el === null) {
    fileInputs.value[index] = el;
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
    groups: [
      {
        instruction: '',
        questions: [
          { type: 'Multiple Choice', text: '', options: [''], answer: '' }
        ]
      }
    ]
  })
}

function removeSection(index: number) {
  sections.value.splice(index, 1)
}

function addGroup(sectionIndex: number) {
  sections.value[sectionIndex].groups.push({
    instruction: '',
    questions: []
  })
}

function addQuestion(sectionIndex: number, groupIndex: number) {
  sections.value[sectionIndex].groups[groupIndex].questions.push({
    type: 'Multiple Choice',
    text: '',
    options: [''],
    answer: ''
  })
}

function removeQuestion(sectionIndex: number, groupIndex: number, qIndex: number) {
  sections.value[sectionIndex].groups[groupIndex].questions.splice(qIndex, 1)
}

function addOption(sectionIndex: number, groupIndex: number, qIndex: number) {
  sections.value[sectionIndex].groups[groupIndex].questions[qIndex].options.push('')
}

function removeOption(sectionIndex: number, groupIndex: number, qIndex: number, optIndex: number) {
  const options = sections.value[sectionIndex].groups[groupIndex].questions[qIndex].options
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

function getGlobalQuestionNumber(sectionIndex: number, groupIndex: number, qIndex: number): number {
  let count = 0
  for (let i = 0; i < sectionIndex; i++) {
    for (const g of sections.value[i].groups) {
      count += g.questions.length
    }
  }
  for (let j = 0; j < groupIndex; j++) {
    count += sections.value[sectionIndex].groups[j].questions.length
  }
  return count + qIndex + 1
}

function submitReading() {
  console.log('Submitting Reading Test:', sections.value)
  testStore.setReadingQuestions(sections.value)
  alert('Reading test saved successfully!')
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