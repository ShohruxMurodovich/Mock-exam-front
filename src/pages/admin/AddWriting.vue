<template>
  <div class="max-w-3xl mx-auto mt-10 p-6">
    <h2 class="text-2xl font-bold mb-8">Add Writing Questions</h2>

    <form @submit.prevent="saveQuestions" class="space-y-8">

      <!-- Task 1 -->
      <div>
        <label class="flex items-center text-sm font-semibold mb-2 gap-2" for="task1">
          <FileText class="w-4 h-4" />
          Task 1
        </label>
        <textarea
          id="task1"
          v-model="task1.text"
          rows="6"
          class="w-full border rounded p-2 focus:outline-none hover:border-[#AEB2C9] focus:border-[#AEB2C9] transition-all"
          required
        ></textarea>

        <!-- Drag & Drop Image Upload -->
        <div
          class="mt-4 p-2 border-2 border-dashed rounded hover:bg-gray-50 transition cursor-pointer flex flex-col items-center text-center"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <UploadCloud class="w-6 h-6 mb-2 text-gray-500" />
          <p class="text-sm text-gray-600">
            Click or drag and drop an image here (optional)
          </p>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onImageUpload"
          />
        </div>

        <!-- Image Preview + Delete -->
        <div v-if="task1.imageUrl" class="mt-4 relative inline-block group">
          <img :src="task1.imageUrl" alt="Preview" style="width: 100%;" class="rounded shadow border"/>
          <button
            @click.prevent="removeImage"
            class="absolute top-1 right-1 bg-white border border-gray-300 rounded-full p-1 text-red-500 hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Task 2 -->
      <div>
        <label class="flex items-center text-sm font-semibold mb-2 gap-2" for="task2">
          <PencilLine class="w-4 h-4" />
          Task 2
        </label>
        <textarea
          id="task2"
          v-model="task2"
          rows="6"
          class="w-full border rounded p-2 focus:outline-none hover:border-[#AEB2C9] focus:border-[#AEB2C9] transition-colors"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        class="flex items-center bg-[#363740] text-white px-4 py-2 rounded hover:bg-[#323c46] transition"
      >
          <SaveIcon class="w-4 h-4 mr-2" />
        Save Writing Tasks
      </button>
    </form>

    <div v-if="saved" class="mt-6 text-green-600 font-semibold">
      ✅ Writing tasks saved successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FileText, PencilLine, UploadCloud, Trash2, SaveIcon } from 'lucide-vue-next'

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
  console.log('Saved:', {
    task1: task1.value,
    task2: task2.value,
  })

  saved.value = true
}
</script>
