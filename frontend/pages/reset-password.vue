<template>
  <div class="reset-password-page">
    <!-- Preloader -->
    <div v-if="isLoading" class="preloader">
      <div class="preloader-content">
        <div class="preloader-ring"></div>
        <p class="preloader-text">AirBorn</p>
      </div>
    </div>

    <div class="reset-container">
      <!-- Left Side -->
      <div class="reset-left">
        <div class="reset-left-content">
          <div class="logo-large">
            <div class="logo-mark-large">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L4 12L16 20L28 12L16 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M4 20L16 28L28 20" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <circle cx="16" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <span class="logo-text-large">AirBorn</span>
          </div>

          <div class="hero-quote">
            <h2>Восстановление пароля</h2>
            <p>Придумайте новый пароль для доступа к вашему аккаунту</p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Минимум 8 символов</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Надежный пароль</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Безопасный вход</span>
            </div>
          </div>
        </div>

        <div class="reset-left-bg">
          <div class="bg-gradient"></div>
          <div class="bg-particles"></div>
        </div>
      </div>

      <!-- Right Side - Reset Form -->
      <div class="reset-right">
        <div class="reset-form-wrapper">
          <div class="form-header">
            <h1 class="form-title">Новый пароль</h1>
            <p class="form-subtitle">Введите новый пароль для вашего аккаунта</p>
          </div>

          <form @submit.prevent="handleResetPassword" class="reset-form">
            <div class="form-group">
              <label for="newPassword" class="form-label">Новый пароль</label>
              <div class="password-input-wrapper">
                <input
                  id="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.newPassword"
                  placeholder="Придумайте пароль"
                  required
                  class="form-input"
                  :disabled="isSubmitting"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                  :disabled="isSubmitting"
                >
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4C3 4 1 10 1 10C1 10 3 16 10 16C17 16 19 10 19 10C19 10 17 4 10 4Z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 2L18 18M6.71289 6.72266C4.66406 8.01172 3.51953 10 3.51953 10C3.51953 10 5.51953 16 10 16C11.5742 16 12.9297 15.4531 14.0117 14.6016M12.0156 7.99219C11.375 7.35547 10.5195 7 9.58203 7C7.57422 7 5.94141 8.63281 5.94141 10.6406C5.94141 11.5781 6.29688 12.4336 6.93359 13.0742" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M14.0547 9.9375C14.0547 11.9453 12.4219 13.5781 10.4141 13.5781" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <p v-if="passwordError" class="password-error">{{ passwordError }}</p>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="form.confirmPassword"
                  placeholder="Повторите пароль"
                  required
                  class="form-input"
                  :disabled="isSubmitting"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="password-toggle"
                  :disabled="isSubmitting"
                >
                  <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4C3 4 1 10 1 10C1 10 3 16 10 16C17 16 19 10 19 10C19 10 17 4 10 4Z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 2L18 18M6.71289 6.72266C4.66406 8.01172 3.51953 10 3.51953 10C3.51953 10 5.51953 16 10 16C11.5742 16 12.9297 15.4531 14.0117 14.6016M12.0156 7.99219C11.375 7.35547 10.5195 7 9.58203 7C7.57422 7 5.94141 8.63281 5.94141 10.6406C5.94141 11.5781 6.29688 12.4336 6.93359 13.0742" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M14.0547 9.9375C14.0547 11.9453 12.4219 13.5781 10.4141 13.5781" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn-reset-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Сохранение...' : 'Сохранить новый пароль' }}
            </button>

            <div v-if="resetError" class="alert-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>{{ resetError }}</span>
            </div>

            <div v-if="resetSuccess" class="alert-success">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 16C14.4183 16 18 12.4183 18 8C18 3.58172 14.4183 0 10 0C5.58172 0 2 3.58172 2 8C2 12.4183 5.58172 16 10 16Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6.5 8L9 10.5L13.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Пароль успешно изменен! Перенаправление на вход...</span>
            </div>

            <div class="form-footer">
              <NuxtLink to="/login" class="back-link">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Вернуться ко входу
              </NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Восстановление пароля | AirBorn',
  meta: [
    { name: 'description', content: 'Восстановление пароля для доступа к AirBorn' }
  ]
});

const config = useRuntimeConfig();
const route = useRoute();

const isLoading = ref(true);
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const resetError = ref('');
const resetSuccess = ref(false);
const passwordError = ref('');

const form = ref({
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  // Check if token exists
  if (!route.query.token) {
    resetError.value = 'Отсутствует токен восстановления пароля';
  }
});

const handleResetPassword = async () => {
  passwordError.value = '';
  resetError.value = '';
  
  // Validate passwords match
  if (form.value.newPassword !== form.value.confirmPassword) {
    passwordError.value = 'Пароли не совпадают';
    return;
  }

  // Validate password length
  if (form.value.newPassword.length < 8) {
    passwordError.value = 'Пароль должен содержать минимум 8 символов';
    return;
  }

  isSubmitting.value = true;

  try {
    const { data, error } = await useFetch(`${config.public.apiUrl}/auth/reset-password`, {
      method: 'POST',
      body: {
        token: route.query.token as string,
        newPassword: form.value.newPassword
      }
    });

    if (error.value) {
      resetError.value = error.value.data?.error?.message || 'Ошибка при сбросе пароля';
      return;
    }

    if (data.value && data.value.success) {
      resetSuccess.value = true;
      setTimeout(() => {
        navigateTo('/login');
      }, 2000);
    }
  } catch (err) {
    resetError.value = 'Произошла ошибка. Попробуйте позже.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.reset-page {
  min-height: 100vh;
  overflow: hidden;
}

.reset-container {
  display: flex;
  min-height: 100vh;
}

/* Left Side Styles */
.reset-left {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
}

.reset-left-content {
  position: relative;
  z-index: 2;
  max-width: 480px;
  padding: 48px;
  color: white;
}

.logo-large {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 80px;
}

.logo-mark-large {
  color: #3b82f6;
  display: flex;
  align-items: center;
}

.logo-text-large {
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.hero-quote {
  margin-bottom: 48px;
}

.hero-quote h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-quote p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.feature-item svg {
  color: #3b82f6;
  flex-shrink: 0;
}

.reset-left-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
}

.bg-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.2) 1px, transparent 0);
  background-size: 40px 40px;
}

/* Right Side Styles */
.reset-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  overflow-y: auto;
  padding: 48px 24px;
}

.reset-form-wrapper {
  max-width: 480px;
  width: 100%;
}

.form-header {
  margin-bottom: 40px;
  text-align: center;
}

.form-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.form-subtitle {
  font-size: 16px;
  color: #64748b;
  line-height: 1.5;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input:disabled {
  background: #F3F4F6;
  cursor: not-allowed;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  left: auto !important;
}

.password-toggle:hover {
  color: #2563eb;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.password-error {
  color: #dc2626;
  font-size: 13px;
  margin-top: 4px;
}

.btn-reset-submit {
  padding: 14px 24px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset-submit:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-reset-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fee2e2;
  border-radius: 12px;
  color: #991b1b;
  font-size: 14px;
}

.alert-error svg {
  flex-shrink: 0;
}

.alert-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #D1FAE5;
  border-radius: 12px;
  color: #065F46;
  font-size: 14px;
}

.alert-success svg {
  flex-shrink: 0;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
}

.back-link:hover {
  background: #f1f5f9;
  color: #2563eb;
}

/* Preloader */
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

.preloader-ring {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 3px solid rgba(37, 99, 235, 0.2);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preloader-text {
  color: white;
  font-size: 18px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .reset-left {
    flex: 1.2;
  }

  .reset-right {
    flex: 0.8;
  }

  .hero-quote h2 {
    font-size: 28px;
  }

  .hero-quote p {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .reset-container {
    flex-direction: column;
  }

  .reset-left {
    min-height: 40vh;
  }

  .reset-left-content {
    padding: 32px;
    text-align: center;
  }

  .logo-large {
    justify-content: center;
    margin-bottom: 40px;
  }

  .hero-quote h2 {
    font-size: 24px;
  }

  .features-list {
    display: none;
  }

  .reset-right {
    padding: 40px 24px;
  }

  .form-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .reset-left-content {
    padding: 24px;
  }

  .hero-quote h2 {
    font-size: 20px;
  }

  .hero-quote p {
    font-size: 13px;
  }

  .reset-form-wrapper {
    padding: 0;
  }

  .form-title {
    font-size: 24px;
  }

  .form-subtitle {
    font-size: 14px;
  }
}
</style>
