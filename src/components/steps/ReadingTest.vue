<template>
  <div v-if="currentSection" class="min-h-screen flex flex-col">
    <!-- Main layout -->
    <div class="flex-grow flex flex-col md:flex-row gap-6 max-w-8xl mx-auto p-6">
      <!-- Passage column -->
      <div class="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-xl overflow-y-auto max-h-[85vh]">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">{{ currentSection.title }}</h2>
        <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ currentSection.passage }}</p>
      </div>

      <!-- Questions column -->
      <div class="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-xl overflow-y-auto max-h-[85vh]">
        <div
          v-for="(group, groupIndex) in currentSection.groups"
          :key="groupIndex"
          class="mb-8 border-b pb-4"
        >
          <!-- Group instruction -->
          <p class="font-semibold text-lg mb-2 text-blue-700">{{ group.instruction }}</p>

          <!-- Paragraph Matching: A–F list above -->
          <div
            v-if="group.type === 'Paragraph Matching' && group.explanation"
            class="text-sm text-gray-600 mb-4"
          >
            <strong class="text-black">Options:</strong>
            {{ group.explanation }}
          </div>

          <!-- Questions -->
          <div
            v-for="(question, qIndex) in group.questions"
            :key="qIndex"
            class="mb-4"
          >
            <p class="mb-1 font-medium">
              Q{{ globalQuestionNumber(groupIndex, qIndex) }}. {{ question.text }}
            </p>

            <!-- Paragraph Matching: A-F -->
            <div v-if="group.type === 'Paragraph Matching' && group.explanation">
              <div
                v-for="(option, oIndex) in group.explanation.split('\t').slice(0, 6)"
                :key="oIndex"
              >
                <label class="flex items-center gap-2">
                  <input
                    type="radio"
                    :name="`group-${groupIndex}-q-${qIndex}`"
                    :value="String.fromCharCode(65 + oIndex)"
                    v-model="answers[sectionIndex][groupIndex][qIndex]"
                    class="accent-blue-600"
                  />
                  <span>{{ String.fromCharCode(65 + oIndex) }}.</span>
                </label>
              </div>
            </div>

            <!-- Multiple Choice -->
            <div v-else-if="group.type === 'Multiple Choice'">
              <div
                v-for="(option, oIndex) in question.options"
                :key="oIndex"
              >
                <label class="flex items-center gap-2">
                  <input
                    type="radio"
                    :name="`group-${groupIndex}-q-${qIndex}`"
                    :value="option"
                    v-model="answers[sectionIndex][groupIndex][qIndex]"
                    class="accent-blue-600"
                  />
                  <span>{{ option }}</span>
                </label>
              </div>
            </div>

            <!-- Yes/No/Not Given OR True/False/Not Given as select -->
            <div v-else-if="group.type === 'Yes/No/Not Given' || group.type === 'True/False/Not Given'">
              <select
                v-model="answers[sectionIndex][groupIndex][qIndex]"
                class="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              >
                <option value="">Select an answer</option>
                <option v-if="group.type === 'Yes/No/Not Given'">Yes</option>
                <option v-if="group.type === 'Yes/No/Not Given'">No</option>
                <option>Not Given</option>
                <option v-if="group.type === 'True/False/Not Given'">True</option>
                <option v-if="group.type === 'True/False/Not Given'">False</option>
              </select>
            </div>

            <!-- Sentence Completion -->
            <div v-else-if="group.type === 'Sentence Completion'">
              <input
                v-model="answers[sectionIndex][groupIndex][qIndex]"
                type="text"
                class="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                placeholder="Write your answer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky pagination and control -->
    <!-- Sticky Bottom Navigation -->
<div class="sticky bottom-0 bg-white border-t shadow-md z-10 py-4 px-6">
  <div class="flex flex-wrap justify-between items-center gap-4">
    <!-- Previous Button -->
    <button
      @click="prevSection"
      :disabled="sectionIndex === 0"
      class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
    >
      Previous
    </button>

    <!-- Section Pagination Buttons -->
    <div class="flex flex-wrap gap-2 justify-center flex-grow">
      <button
        v-for="(_, i) in readingQuestions"
        :key="i"
        @click="goToSection(i)"
        :class="[
          'px-3 py-2 rounded-md text-sm font-medium border transition-all duration-150',
          sectionIndex === i
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        ]"
      >
        Section {{ i + 1 }}
      </button>
    </div>

    <!-- Next or Submit Button -->
    <button
      v-if="sectionIndex < readingQuestions.length - 1"
      @click="nextSection"
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Next
    </button>
    <button
      v-else
      @click="$emit('next')"
      class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Submit Reading
    </button>
  </div>
</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useTestStore } from '../../store/testStore'

const testStore = useTestStore()
const readingQuestions = testStore.readingQuestions
const sectionIndex = ref(0)

const currentSection = computed(() => readingQuestions[sectionIndex.value])

const answers = ref(
  readingQuestions.map(section =>
    section.groups.map(group => group.questions.map(() => ''))
  )
)

function nextSection() {
  if (sectionIndex.value < readingQuestions.length - 1) sectionIndex.value++
}
function prevSection() {
  if (sectionIndex.value > 0) sectionIndex.value--
}
function goToSection(i: number) {
  sectionIndex.value = i
}

// Global numbering
function globalQuestionNumber(groupIndex: number, qIndex: number): number {
  const groups = currentSection.value?.groups || []
  let count = 0
  for (let i = 0; i < groupIndex; i++) {
    count += groups[i].questions.length
  }
  return count + qIndex + 1
}
</script>

<style scoped>
input[type='radio'] {
  accent-color: #2563eb;
}
</style>