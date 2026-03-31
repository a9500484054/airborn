<template>
  <NuxtLayout name="default">
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <NuxtLink to="/" class="logo">
              <span class="logo-icon">✈</span>
              <span class="logo-text">AirBorn</span>
            </NuxtLink>
            <h1>Welcome Back</h1>
            <p class="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="you@example.com"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="••••••••"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary btn-lg"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </button>
            </div>

            <div v-if="error" class="alert alert-error">
              {{ error }}
            </div>

            <div class="auth-footer">
              <p>
                Don't have an account?
                <NuxtLink to="/register">Sign up</NuxtLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const authStore = useAuthStore();
const route = useRoute();

const form = ref({
  email: '',
  password: '',
});
const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  const result = await authStore.login(form.value.email, form.value.password);

  if (result.success) {
    const redirect = route.query.redirect as string || '/dashboard';
    navigateTo(redirect);
  } else {
    error.value = result.error || 'Login failed';
  }

  isLoading.value = false;
};

// Page metadata
useHead({
  title: 'Login - AirBorn',
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-xl);
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.auth-header {
  padding: var(--spacing-2xl) var(--spacing-2xl) var(--spacing-xl);
  text-align: center;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  margin-bottom: var(--spacing-lg);
}

.logo-icon {
  font-size: 1.5em;
}

.auth-header h1 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  color: var(--color-text-secondary);
}

.auth-form {
  padding: 0 var(--spacing-2xl) var(--spacing-2xl);
}

.form-actions {
  margin-top: var(--spacing-xl);
}

.form-actions .btn {
  width: 100%;
}

.auth-footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-secondary);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
