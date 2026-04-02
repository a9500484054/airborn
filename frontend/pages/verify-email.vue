<template>
  <NuxtLayout>
    <div class="verify-email-page">
    <div class="verify-container">
      <!-- Loading State -->
      <div v-if="loading" class="verify-state">
        <div class="state-animation">
          <div class="spinner-ring"></div>
          <div class="spinner-pulse"></div>
        </div>
        <div class="state-content">
          <h2>Проверка email</h2>
          <p>Пожалуйста, подождите, мы проверяем ваш email адрес...</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="verify-state success">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M14 24L20 30L34 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="state-content">
          <h2>Email подтвержден!</h2>
          <p>Ваш email успешно подтвержден. Теперь вы можете войти в систему.</p>
          <div class="success-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Верификация пройдена</span>
          </div>
        </div>
        <div class="state-actions">
          <NuxtLink to="/login" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2V10M10 10L13 7M10 10L7 7M4 16H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Войти в аккаунт
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="verify-state error">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M16 16L32 32M32 16L16 32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="state-content">
          <h2>Ошибка верификации</h2>
          <p class="error-message">{{ error }}</p>
          <div class="error-hint">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 4V9M8 11H8.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            <span>Ссылка могла истечь или быть использована</span>
          </div>
        </div>
        <div class="state-actions">
          <button @click="resendVerification" class="btn-primary" :disabled="resending">
            <svg v-if="!resending" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C12.5 2.5 14.5 3.5 16 5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C7.5 17.5 5.5 16.5 4 15M2.5 2.5V5.5H5.5M17.5 17.5V14.5H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <div v-else class="spinner-small"></div>
            {{ resending ? 'Отправка...' : 'Отправить повторно' }}
          </button>
          <NuxtLink to="/login" class="btn-outline">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Вернуться
          </NuxtLink>
        </div>
      </div>
    </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: false,
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref(false);
const error = ref('');
const resending = ref(false);

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    error.value = 'Токен верификации не найден. Проверьте ссылку в письме.';
    loading.value = false;
    return;
  }

  try {
    const config = useRuntimeConfig();
    
    // Client-side fetch instead of useFetch
    const response = await fetch(`${config.public.apiUrl}/auth/verify-email?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка верификации');
    }

    if (result.success) {
      success.value = true;
      loading.value = false;

      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      throw new Error(result.message || 'Ошибка верификации');
    }
  } catch (err: any) {
    console.error('Verification error:', err);

    // Handle different error types
    if (err.message?.includes('400')) {
      error.value = 'Неверный токен верификации';
    } else if (err.message?.includes('404')) {
      error.value = 'Токен не найден или уже использован';
    } else if (err.message?.includes('410')) {
      error.value = 'Срок действия ссылки истек. Запросите новое письмо.';
    } else {
      error.value = err.message || 'Не удалось подтвердить email. Попробуйте позже.';
    }

    loading.value = false;
  }
});

const resendVerification = async () => {
  const email = route.query.email as string || authStore.user?.email;

  if (!email) {
    error.value = 'Email не указан. Пожалуйста, вернитесь на страницу входа.';
    return;
  }

  resending.value = true;

  try {
    const config = useRuntimeConfig();
    
    // Client-side fetch
    const response = await fetch(`${config.public.apiUrl}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка при отправке письма');
    }

    if (result.success) {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'toast-success';
      successMessage.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="white" stroke-width="1.5"/>
        </svg>
        <span>Письмо отправлено! Проверьте вашу почту</span>
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

      // Clear error message
      error.value = '';
    }
  } catch (err: any) {
    const errorMessage = err.message || 'Ошибка при отправке письма. Попробуйте позже.';
    alert(errorMessage);
  } finally {
    resending.value = false;
  }
};

useHead({
  title: success.value ? 'Email подтвержден - AirBorn' : 'Верификация email - AirBorn',
});
</script>

<style scoped>
.verify-email-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Background Pattern */
.verify-email-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.1) 1px, transparent 0);
  background-size: 40px 40px;
  opacity: 0.5;
}

.verify-container {
  position: relative;
  z-index: 1;
  max-width: 500px;
  width: 100%;
  animation: fadeInUp 0.6s ease-out;
}

/* Verify State Card */
.verify-state {
  background: white;
  border-radius: 32px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

.verify-state.success {
  border-top: 4px solid #10b981;
}

.verify-state.error {
  border-top: 4px solid #ef4444;
}

/* Loading Animation */
.state-animation {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 32px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  animation: pulse 1.5s ease-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

/* Success Icon */
.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: scaleIn 0.5s ease-out;
}

.success-icon svg {
  width: 48px;
  height: 48px;
}

/* Error Icon */
.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: shake 0.5s ease-out;
}

.error-icon svg {
  width: 48px;
  height: 48px;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* State Content */
.state-content {
  margin-bottom: 32px;
}

.state-content h2 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.state-content p {
  color: #64748b;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.error-message {
  background: #fef2f2;
  padding: 12px 16px;
  border-radius: 12px;
  color: #dc2626;
  font-weight: 500;
  margin: 16px 0;
}

.error-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 13px;
  color: #475569;
}

.error-hint svg {
  color: #94a3b8;
}

.success-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #d1fae5;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #065f46;
  margin-top: 16px;
}

.success-badge svg {
  color: #10b981;
}

/* State Actions */
.state-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-outline {
  background: transparent;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

/* Spinner Small */
.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Toast Notification */
.toast-success {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #10b981;
  color: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease-out;
  z-index: 1000;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .verify-state {
    padding: 32px 24px;
  }

  .state-content h2 {
    font-size: 24px;
  }

  .state-content p {
    font-size: 14px;
  }

  .state-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-outline {
    justify-content: center;
  }

  .success-icon,
  .error-icon {
    width: 64px;
    height: 64px;
  }

  .success-icon svg,
  .error-icon svg {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .verify-state {
    padding: 24px 20px;
  }

  .state-content h2 {
    font-size: 20px;
  }
}
</style>
