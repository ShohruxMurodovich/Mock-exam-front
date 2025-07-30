<template>
  <div class="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">Add Writing Questions</h2>

    <form @submit.prevent="saveQuestions" class="space-y-10">

      <!-- Task 1 -->
      <div>
        <label class="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2" for="task1">
          <FileText class="w-4 h-4 text-gray-500" />
          Task 1
        </label>
        <textarea
          id="task1"
          v-model="task1.text"
          rows="6"
          placeholder="Enter Task 1 question here..."
          class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all"
          required
        ></textarea>

        <!-- Drag & Drop Upload -->
        <div
          class="mt-4 p-5 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm text-center cursor-pointer transition-all"
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
        <label class="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2" for="task2">
          <PencilLine class="w-4 h-4 text-gray-500" />
          Task 2
        </label>
        <textarea
          id="task2"
          v-model="task2"
          rows="6"
          placeholder="Enter Task 2 question here..."
          class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all"
          required
        ></textarea>
      </div>

      <!-- Save Button -->
      <button
        type="submit"
        class="inline-flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-md hover:bg-gray-700 transition"
      >
        <SaveIcon class="w-4 h-4" />
        Save Writing Tasks
      </button>
    </form>

    <!-- Success Message -->
    <div v-if="saved" class="mt-6 text-green-600 font-medium flex items-center gap-2">
      ✅ Writing tasks saved successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FileText, PencilLine, UploadCloud, Trash2, SaveIcon } from 'lucide-vue-next'
import { useTestStore } from '../../store/testStore'

const testStore = useTestStore()

const task1 = ref<{ text: string; image: File | null; imageUrl: string | null }>({
  text: '',
  image: null,
  imageUrl: null,
})

const task2 = ref<string>('')
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
      image: task1.value.image
    },
    task2.value
  )

  console.log('Saved:', {
    task1: task1.value,
    task2: task2.value,
  })

  saved.value = true
}
</script>