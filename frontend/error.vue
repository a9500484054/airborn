<template>
  <NuxtLayout>
    <div class="not-found-page">
      <div class="not-found-card">
        <!-- 404 Icon -->
        <div class="error-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- Error Code -->
        <div class="error-code">{{ error.statusCode }}</div>

        <!-- Title -->
        <h1 class="error-title">{{ error.statusCode === 404 ? 'Страница не найдена' : 'Ошибка' }}</h1>

        <!-- Description -->
        <p class="error-description">
          <template v-if="error.statusCode === 404">
            К сожалению, страница, которую вы ищете,<br>
            не существует или была перемещена.
          </template>
          <template v-else>
            Произошла непредвиденная ошибка.<br>
            Попробуйте обновить страницу или позже.
          </template>
        </p>

        <!-- Actions -->
        <div class="error-actions">
          <NuxtLink to="/dashboard" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            На главную
          </NuxtLink>
          <button class="btn-secondary" @click="handleError">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9H15M3 9L7 5M3 9L7 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Назад
          </button>
        </div>

        <!-- Help Link -->
        <div class="help-link">
          <NuxtLink to="/chat">
            Нужна помощь? Обратитесь в поддержку
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const error = useError();

const handleError = () => {
  clearError({ redirect: '/' });
};

useHead({
  title: error.value?.statusCode === 404 ? '404 - Страница не найдена | AirBorn' : `${error.value?.statusCode} - Ошибка | AirBorn`,
});
</script>

<style scoped>
.not-found-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-card {
  max-width: 500px;
  width: 100%;
  text-align: center;
  padding: 48px 40px;
  background: white;
  border-radius: 32px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
}

/* Error Icon */
.error-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 24px;
  background: #fef2f2;
  border-radius: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
}

/* Error Code */
.error-code {
  font-size: 80px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: -2px;
}

/* Title */
.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

/* Description */
.error-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* Actions */
.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: #0f172a;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #3b82f6;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
  background: #f8fafc;
}

/* Help Link */
.help-link {
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.help-link a {
  color: #3b82f6;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s ease;
}

.help-link a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .not-found-card {
    padding: 32px 24px;
  }

  .error-code {
    font-size: 64px;
  }

  .error-title {
    font-size: 20px;
  }

  .error-description {
    font-size: 13px;
  }

  .error-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .not-found-card {
    padding: 24px 20px;
  }

  .error-icon {
    width: 80px;
    height: 80px;
  }

  .error-icon svg {
    width: 60px;
    height: 60px;
  }

  .error-code {
    font-size: 48px;
  }
}
</style>
