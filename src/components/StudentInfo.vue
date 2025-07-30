<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in"
    >
      <h2 class="text-2xl font-bold text-center text-blue-800">
        Enter Your Information
      </h2>

      <input
        v-model="name"
        type="text"
        placeholder="Full Name"
        class="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
      />

      <input
        v-model="group"
        type="text"
        placeholder="Group"
        class="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
      />

      <button
        @click="saveInfo"
        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
      >
        Start Mock Exam
      </button>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue'
// import { useTestStore } from '../store/testStore'

// const store = useTestStore()
const name = ref('')
const group = ref('')

function saveInfo() {
  // store.setStudentInfo(name.value, group.value)
}
</script>

<style scoped>
@keyframes fade-in {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out both;
}
</style>