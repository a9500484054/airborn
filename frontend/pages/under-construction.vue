<template>
  <NuxtLayout>
    <div class="construction-page">
      <div class="construction-card">
        <!-- Icon -->
        <div class="construction-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        </div>

        <!-- Title -->
        <h1 class="construction-title">Страница в разработке</h1>

        <!-- Description -->
        <p class="construction-description">
          Мы работаем над этой страницей.<br>
          Скоро здесь появится полезная информация.
        </p>

        <!-- Action Button -->
        <NuxtLink to="/" class="back-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Вернуться на главную
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

useHead({
  title: 'Страница в разработке - AirBorn',
});
</script>

<style scoped>
.construction-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.construction-card {
  max-width: 500px;
  width: 100%;
  text-align: center;
  padding: 48px 32px;
  background: white;
  border-radius: 24px;
  border: 1px solid #eef2ff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.construction-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #eff6ff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.construction-title {
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.construction-description {
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 32px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #0f172a;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #3b82f6;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 640px) {
  .construction-card {
    padding: 32px 24px;
  }
  
  .construction-title {
    font-size: 24px;
  }
  
  .construction-description {
    font-size: 14px;
  }
  
  .construction-icon {
    width: 64px;
    height: 64px;
  }
  
  .construction-icon svg {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .construction-card {
    padding: 24px 20px;
  }
  
  .construction-title {
    font-size: 20px;
  }
  
  .back-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>