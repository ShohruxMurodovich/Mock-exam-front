<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-blue-100/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <h2 class="text-xl font-bold text-blue-800 text-center">Start Section</h2>
        <p class="text-gray-600 text-center">
          You're about to begin the <strong>{{ sectionName }}</strong> section.<br />
          Make sure you're ready — once you start, the timer begins.
        </p>

        <button
          @click="$emit('confirm')"
          class="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow"
        >
          Start Test
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; sectionName: string }>()
defineEmits(['confirm'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out both;
}
</style>