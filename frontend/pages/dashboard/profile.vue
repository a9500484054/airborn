<template>
  <NuxtLayout name="authenticated">
    <div class="profile-page">
      <div class="page-header">
        <h1 class="page-title">Edit Profile</h1>
        <NuxtLink to="/dashboard" class="btn btn-outline btn-sm">← Back</NuxtLink>
      </div>

      <div class="profile-grid">
        <!-- Profile Form -->
        <div class="card">
          <div class="card-header">
            <h2>Profile Information</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label class="form-label" for="name">Full Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  disabled
                />
                <p class="form-hint">Email cannot be changed</p>
              </div>

              <div class="form-group">
                <label class="form-label" for="phone">Phone</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>

              <div v-if="success" class="alert alert-success">
                Profile updated successfully!
              </div>
              <div v-if="error" class="alert alert-error">
                {{ error }}
              </div>
            </form>
          </div>
        </div>

        <!-- Change Password -->
        <div class="card">
          <div class="card-header">
            <h2>Change Password</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword" class="password-form">
              <div class="form-group">
                <label class="form-label" for="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="newPassword">New Password</label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-input"
                  placeholder="Minimum 8 characters"
                  required
                  minlength="8"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isPasswordLoading"
                >
                  {{ isPasswordLoading ? 'Changing...' : 'Change Password' }}
                </button>
              </div>

              <div v-if="passwordSuccess" class="alert alert-success">
                Password changed successfully!
              </div>
              <div v-if="passwordError" class="alert alert-error">
                {{ passwordError }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const authStore = useAuthStore();

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isLoading = ref(false);
const success = ref(false);
const error = ref('');

const isPasswordLoading = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref('');

const updateProfile = async () => {
  isLoading.value = true;
  success.value = false;
  error.value = '';

  const result = await authStore.updateProfile({
    name: form.value.name,
    phone: form.value.phone,
  });

  if (result.success) {
    success.value = true;
    setTimeout(() => success.value = false, 3000);
  } else {
    error.value = result.error || 'Failed to update profile';
  }

  isLoading.value = false;
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Passwords do not match';
    return;
  }

  isPasswordLoading.value = true;
  passwordSuccess.value = false;
  passwordError.value = '';

  const result = await authStore.changePassword(
    passwordForm.value.currentPassword,
    passwordForm.value.newPassword
  );

  if (result.success) {
    passwordSuccess.value = true;
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    setTimeout(() => passwordSuccess.value = false, 3000);
  } else {
    passwordError.value = result.error || 'Failed to change password';
  }

  isPasswordLoading.value = false;
};

useHead({
  title: 'Edit Profile - AirBorn',
});
</script>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.profile-grid {
  display: grid;
  gap: var(--spacing-xl);
}

.form-actions {
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>
