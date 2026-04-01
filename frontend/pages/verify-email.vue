<template>
  <div class="verify-email-page">
    <div class="verify-container">
      <!-- Loading State -->
      <div v-if="loading" class="verify-loading">
        <div class="spinner"></div>
        <p>Проверка вашего email...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="verify-success">
        <div class="success-icon">✓</div>
        <h1>Email подтвержден!</h1>
        <p>Ваш email успешно подтвержден. Теперь вы можете войти в систему.</p>
        <NuxtLink to="/login" class="btn btn-primary">
          Войти
        </NuxtLink>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="verify-error">
        <div class="error-icon">✕</div>
        <h1>Ошибка верификации</h1>
        <p>{{ error }}</p>
        <div class="error-actions">
          <NuxtLink to="/login" class="btn btn-outline">
            Вернуться ко входу
          </NuxtLink>
          <button @click="resendVerification" class="btn btn-primary" :disabled="resending">
            {{ resending ? 'Отправка...' : 'Отправить повторно' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const success = ref(false);
const error = ref('');
const resending = ref(false);

onMounted(async () => {
  const token = route.query.token as string;

  console.log('Verify email page loaded, token:', token ? 'present' : 'missing');

  if (!token) {
    error.value = 'Токен верификации не найден';
    loading.value = false;
    return;
  }

  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    console.log('Calling API:', `${apiUrl}/auth/verify-email?token=${token}`);
    
    const { data } = await useFetch(`${apiUrl}/auth/verify-email?token=${token}`, {
      method: 'GET',
    });

    console.log('API response:', data.value);

    if (data.value) {
      const response = data.value as any;
      if (response.success) {
        success.value = true;
        loading.value = false;
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    }
  } catch (err: any) {
    console.error('Verification error:', err);
    error.value = err.data?.error?.message || 'Неверный или истекший токен верификации';
    loading.value = false;
  }
});

const resendVerification = async () => {
  if (!authStore.user?.email) return;

  resending.value = true;

  try {
    const config = useRuntimeConfig();
    await useFetch(`${config.public.apiUrl}/auth/resend-verification`, {
      method: 'POST',
      body: { email: authStore.user.email },
    });

    alert('Письмо с подтверждением отправлено! Проверьте вашу почту.');
  } catch (err: any) {
    alert(err.data?.error?.message || 'Ошибка при отправке письма');
  } finally {
    resending.value = false;
  }
};
</script>

<style scoped>
.verify-email-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.verify-container {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.verify-loading,
.verify-success,
.verify-error {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.verify-loading p,
.verify-success p,
.verify-error p {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}

.verify-success h1,
.verify-error h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 15px;
}

.success-icon,
.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 25px;
}

.success-icon {
  background: #d4edda;
  color: #28a745;
}

.error-icon {
  background: #f8d7da;
  color: #dc3545;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 14px 30px;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}
</style>
