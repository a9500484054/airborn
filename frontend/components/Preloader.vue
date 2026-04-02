<template>
  <div v-if="isLoading" class="preloader">
    <div class="preloader-content">
      <div class="logo-animation">
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
          <path class="logo-path-1" d="M16 4L4 12L16 20L28 12L16 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path class="logo-path-2" d="M4 20L16 28L28 20" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <circle class="logo-circle" cx="16" cy="12" r="2" fill="currentColor"/>
        </svg>
      </div>
      <p class="preloader-text">AirBorn</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean;
}>();
</script>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.preloader-content {
  text-align: center;
}

.logo-animation {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #2563eb;
  animation: logoFloat 2s ease-in-out infinite;
}

.logo-animation svg {
  width: 100%;
  height: 100%;
}

.logo-path-1,
.logo-path-2 {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawPath 2s ease-in-out infinite;
}

.logo-path-2 {
  animation-delay: 0.2s;
}

.logo-circle {
  opacity: 0;
  animation: fadeInCircle 2s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
}

@keyframes drawPath {
  0%, 100% {
    stroke-dashoffset: 100;
  }
  50% {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeInCircle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.preloader-text {
  color: white;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 2px;
  animation: textPulse 2s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}
</style>
