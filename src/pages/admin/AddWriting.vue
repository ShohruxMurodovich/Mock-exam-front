<template>
  <div class="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-md animate-fade-in">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">Create IELTS Writing Test</h2>

    <form @submit.prevent="saveQuestions" class="space-y-12">
      <!-- Task 1 -->
      <div>
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Task 1: Visual Description</h3>

        <!-- Task 1 Type Selection -->
        <label class="block text-sm font-medium text-gray-600 mb-1">Select Task 1 Type</label>
        <select v-model="task1.type" class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4">
          <option disabled value="">-- Choose Type --</option>
          <option value="bar_chart">Bar Chart</option>
          <option value="line_graph">Line Graph</option>
          <option value="table">Table</option>
          <option value="map">Map</option>
          <option value="process">Process Diagram</option>
        </select>

        <!-- Task 1 Text -->
        <label class="text-sm font-medium text-gray-700 mb-2 block">Question Text</label>
        <textarea
          v-model="task1.text"
          rows="6"
          placeholder="Enter Task 1 question here..."
          class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          required
        ></textarea>

        <!-- Image Upload -->
        <div
          class="mt-4 p-5 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm text-center cursor-pointer"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <UploadCloud class="w-6 h-6 mx-auto mb-2" />
          Click or drag and drop an image here (optional)
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onImageUpload"
          />
        </div>

        <!-- Image Preview -->
        <div v-if="task1.imageUrl" class="mt-4 relative group">
          <img :src="task1.imageUrl" alt="Preview" class="w-full rounded shadow border border-gray-200" />
          <button
            @click.prevent="removeImage"
            class="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 text-red-500 hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
            title="Remove"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Task 2 -->
      <div>
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Task 2: Essay Question</h3>

        <!-- Task 2 Type Selection -->
        <label class="block text-sm font-medium text-gray-600 mb-1">Select Task 2 Essay Type</label>
        <select v-model="task2Type" class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4">
          <option disabled value="">-- Choose Essay Type --</option>
          <option value="opinion">Opinion</option>
          <option value="discussion">Discussion</option>
          <option value="problem_solution">Problem-Solution</option>
          <option value="advantages_disadvantages">Advantages & Disadvantages</option>
          <option value="two_part">Two-Part Question</option>
        </select>

        <!-- Task 2 Text -->
        <label class="text-sm font-medium text-gray-700 mb-2 block">Question Text</label>
        <textarea
          v-model="task2"
          rows="6"
          placeholder="Enter Task 2 essay question here..."
          class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          required
        ></textarea>
      </div>

      <!-- Save Button -->
      <div class="text-right">
        <button
          type="submit"
          class="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-2.5 rounded-md hover:bg-gray-700 transition"
        >
          <SaveIcon class="w-4 h-4" />
          Save Writing Test
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="saved" class="mt-6 text-green-600 font-medium flex items-center gap-2">
        ✅ Writing tasks saved successfully!
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud, Trash2, SaveIcon } from 'lucide-vue-next'
import { useTestStore } from '../../store/testStore'

const testStore = useTestStore()

const task1 = ref<{ text: string; type: string; image: File | null; imageUrl: string | null }>({
  text: '',
  type: '',
  image: null,
  imageUrl: '',
})

const task2 = ref<string>('')
const task2Type = ref<string>('')
const saved = ref<boolean>(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  handleImage(file)
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  handleImage(file)
}

function handleImage(file: File | undefined) {
  if (file && file.type.startsWith('image/')) {
    task1.value.image = file
    task1.value.imageUrl = URL.createObjectURL(file)
  }
}

function removeImage() {
  task1.value.image = null
  task1.value.imageUrl = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function saveQuestions() {
  testStore.setWritingQuestions(
    {
      text: task1.value.text,
      type: task1.value.type,
      imageUrl: URL.createObjectURL(task1.value.image as File)
    },
    {
      text: task2.value,
      type: task2Type.value,
    }
  )

  console.log('Saved:', {
    task1: task1.value,
    task2: { text: task2.value, type: task2Type.value },
  })

  saved.value = true
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