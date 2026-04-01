<template>
  <div class="login-page">
    <!-- Preloader -->
    <div v-if="isLoading" class="preloader">
      <div class="preloader-content">
        <div class="preloader-ring"></div>
        <p class="preloader-text">AirBorn</p>
      </div>
    </div>

    <div class="login-container">
      <!-- Left Side - Image & Branding -->
      <div class="login-left">
        <div class="login-left-content">
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
            <h2>Добро пожаловать!</h2>
            <p>Введите свои данные для доступа к личному кабинету</p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Управление заказами</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>История монтажей</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Техническая поддержка 24/7</span>
            </div>
          </div>
        </div>

        <div class="login-left-bg">
          <div class="bg-gradient"></div>
          <div class="bg-particles"></div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-right">
        <div class="login-form-wrapper">
          <!-- Login Form -->
          <div v-if="!showForgotPassword" class="form-header">
            <h1 class="form-title">Вход в аккаунт</h1>
            <!-- <p class="form-subtitle">Введите свои данные для доступа к личному кабинету</p> -->
          </div>

          <!-- Forgot Password Form -->
          <div v-else class="form-header">
            <h1 class="form-title">Восстановление пароля</h1>
            <p class="form-subtitle">Введите email, указанный при регистрации. Мы отправим инструкцию по восстановлению пароля.</p>
          </div>

          <!-- Login Form -->
          <form v-if="!showForgotPassword" @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                placeholder="ivan@example.com"
                required
                class="form-input"
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Пароль</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  placeholder="Введите пароль"
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
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" :disabled="isSubmitting">
                <span>Запомнить меня</span>
              </label>
              <button type="button" class="forgot-link" @click="showForgotPasswordForm">
                Забыли пароль?
              </button>
            </div>

            <button type="submit" class="btn-login-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Вход...' : 'Войти' }}
            </button>

            <div v-if="loginError" class="alert-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>{{ loginError }}</span>
            </div>

            <div v-if="loginSuccess" class="alert-success">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 16C14.4183 16 18 12.4183 18 8C18 3.58172 14.4183 0 10 0C5.58172 0 2 3.58172 2 8C2 12.4183 5.58172 16 10 16Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6.5 8L9 10.5L13.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Успешный вход! Перенаправление...</span>
            </div>

            <!-- <div class="form-footer">
              <p>Нет аккаунта? <NuxtLink to="/register" class="register-link">Зарегистрироваться</NuxtLink></p>
            </div> -->
          </form>

          <!-- Forgot Password Form -->
          <form v-else @submit.prevent="handleForgotPassword" class="login-form">
            <div class="form-group">
              <label for="reset-email" class="form-label">Email</label>
              <input
                id="reset-email"
                type="email"
                v-model="resetForm.email"
                placeholder="ivan@example.com"
                required
                class="form-input"
                :disabled="isSubmitting"
              />
            </div>

            <button type="submit" class="btn-login-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Отправка...' : 'Отправить инструкцию' }}
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
              <span>Инструкция отправлена на ваш email. Проверьте почту!</span>
            </div>

            <button type="button" class="btn-back" @click="showForgotPassword = false">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Вернуться ко входу
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Вход | AirBorn',
  meta: [
    { name: 'description', content: 'Войдите в личный кабинет AirBorn для управления заказами и отслеживания монтажа систем вентиляции и кондиционирования.' }
  ]
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();

const isLoading = ref(true);
const isSubmitting = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const loginError = ref('');
const loginSuccess = ref(false);
const showForgotPassword = ref(false);
const resetError = ref('');
const resetSuccess = ref('');

const form = ref({
  email: '',
  password: ''
});

const resetForm = ref({
  email: ''
});

onMounted(() => {
  // Check if already authenticated - redirect to chat immediately
  const accessToken = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');
  
  if (accessToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user) {
        navigateTo('/chat');
        return;
      }
    } catch (e) {
      // Invalid user data, continue to login form
    }
  }

  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  // Check for saved credentials
  const savedEmail = localStorage.getItem('remembered_email');
  if (savedEmail) {
    form.value.email = savedEmail;
    rememberMe.value = true;
  }
});

const handleLogin = async () => {
  isSubmitting.value = true;
  loginError.value = '';
  loginSuccess.value = false;

  try {
    const config = useRuntimeConfig();
    const { data, error } = await useFetch(`${config.public.apiUrl}/auth/login`, {
      method: 'POST',
      body: { email: form.value.email, password: form.value.password }
    });

    if (error.value) {
      loginError.value = error.value.data?.error?.message || 'Неверный email или пароль';
      return;
    }

    if (data.value && data.value.success) {
      loginSuccess.value = true;
      
      // Save auth data to store
      authStore.setAuth(data.value.data);
      
      // Save credentials if remember me is checked
      if (rememberMe.value) {
        localStorage.setItem('remembered_email', form.value.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      // Redirect to chat immediately
      navigateTo('/chat');
    } else {
      loginError.value = 'Неверный email или пароль';
    }
  } catch (err) {
    loginError.value = 'Произошла ошибка. Попробуйте позже.';
  } finally {
    isSubmitting.value = false;
  }
};

const showForgotPasswordForm = () => {
  showForgotPassword.value = true;
  resetError.value = '';
  resetSuccess.value = false;
};

const handleForgotPassword = async () => {
  isSubmitting.value = true;
  resetError.value = '';
  resetSuccess.value = false;

  try {
    const { data, error } = await useFetch(`${config.public.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      body: { email: resetForm.value.email }
    });

    if (error.value) {
      resetError.value = error.value.data?.error?.message || 'Ошибка при отправке инструкции';
    } else {
      resetSuccess.value = true;
    }
  } catch (error) {
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

.login-page {
  min-height: 100vh;
  overflow: hidden;
}

.login-container {
  display: flex;
  min-height: 100vh;
}

/* Left Side Styles */
.login-left {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
}

.login-left-content {
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

.login-left-bg {
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
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  overflow-y: auto;
  padding: 48px 24px;
}

.login-form-wrapper {
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

.login-form {
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
  padding: 12px 16px;
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
}

.password-toggle:hover {
  color: #2563eb;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #475569;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb;
}

.checkbox-label input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.forgot-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}

.forgot-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.btn-login-submit {
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

.btn-login-submit:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-login-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.btn-back:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #f8fafc;
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
  font-size: 14px;
  color: #64748b;
}

.register-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-left {
    flex: 1.2;
  }

  .login-right {
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
  .login-container {
    flex-direction: column;
  }

  .login-left {
    min-height: 40vh;
  }

  .login-left-content {
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

  .login-right {
    padding: 40px 24px;
  }

  .form-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .login-left-content {
    padding: 24px;
  }

  .hero-quote h2 {
    font-size: 20px;
  }

  .hero-quote p {
    font-size: 13px;
  }

  .login-form-wrapper {
    padding: 0;
  }

  .form-title {
    font-size: 24px;
  }

  .form-subtitle {
    font-size: 14px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
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
</style>
