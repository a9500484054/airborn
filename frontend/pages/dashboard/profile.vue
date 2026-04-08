<template>
  <NuxtLayout name="authenticated">
    <div class="profile-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Настройки профиля</h1>
          <p class="page-subtitle">Управляйте информацией вашего аккаунта</p>
        </div>
        <NuxtLink to="/dashboard" class="back-link">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Назад
        </NuxtLink>
      </div>

      <div class="profile-grid">
        <!-- Avatar Upload Card -->
        <div class="card avatar-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 11.25C12.0711 11.25 13.75 9.57107 13.75 7.5C13.75 5.42893 12.0711 3.75 10 3.75C7.92893 3.75 6.25 5.42893 6.25 7.5C6.25 9.57107 7.92893 11.25 10 11.25Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M4.5 16.25C5.5 15 7.5 13.75 10 13.75C12.5 13.75 14.5 15 15.5 16.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </div>
            <h2 class="card-title">Фото профиля</h2>
          </div>
          <div class="card-body">
            <div class="avatar-section">
              <div class="avatar-container">
                <img 
                  v-if="avatarUrl" 
                  :src="avatarUrl" 
                  alt="Avatar" 
                  class="avatar-image"
                />
                <div v-else class="avatar-placeholder">
                  <span class="avatar-initials">{{ authStore.userInitials }}</span>
                </div>
                <div v-if="isAvatarUploading" class="avatar-overlay">
                  <div class="spinner"></div>
                </div>
              </div>
              <div class="avatar-actions">
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  @change="handleAvatarChange"
                  style="display: none"
                />
                <button
                  type="button"
                  class="btn-secondary"
                  @click="$refs.avatarInput.click()"
                  :disabled="isAvatarUploading"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6 2.25H3.75C3.15326 2.25 2.58097 2.48705 2.15901 2.90901C1.73705 3.33097 1.5 3.90326 1.5 4.5V14.25C1.5 14.8467 1.73705 15.419 2.15901 15.841C2.58097 16.2629 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.2629 15.841 15.841C16.2629 15.419 16.5 14.8467 16.5 14.25V12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                    <path d="M12 5.25L9 8.25L6 5.25M9 8.25V1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                  {{ isAvatarUploading ? 'Загрузка...' : 'Загрузить фото' }}
                </button>
                <button
                  v-if="authStore.user?.avatar"
                  type="button"
                  class="btn-outline"
                  @click="removeAvatar"
                  :disabled="isAvatarUploading"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 4.5H15M6 4.5V3C6 2.58579 6.33579 2.25 6.75 2.25H11.25C11.6642 2.25 12 2.58579 12 3V4.5M13.5 4.5V14.25C13.5 14.6642 13.1642 15 12.75 15H5.25C4.83579 15 4.5 14.6642 4.5 14.25V4.5H13.5Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            <transition name="alert">
              <div v-if="avatarError" class="alert-error">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ avatarError }}</span>
              </div>
            </transition>
          </div>
        </div>

        <!-- Profile Information Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 11.25C12.0711 11.25 13.75 9.57107 13.75 7.5C13.75 5.42893 12.0711 3.75 10 3.75C7.92893 3.75 6.25 5.42893 6.25 7.5C6.25 9.57107 7.92893 11.25 10 11.25Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M4.5 16.25C5.5 15 7.5 13.75 10 13.75C12.5 13.75 14.5 15 15.5 16.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </div>
            <h2 class="card-title">Личная информация</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label class="form-label" for="name">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3333 14V12.6667C13.3333 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.374 10 10.6667 10H5.33333C4.62609 10 3.94781 10.281 3.44772 10.781C2.94762 11.2811 2.66667 11.9594 2.66667 12.6667V14" stroke="currentColor" stroke-width="1.2"/>
                    <circle cx="8" cy="4.66667" r="2.66667" stroke="currentColor" stroke-width="1.2"/>
                  </svg>
                  Полное имя
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="email">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2.66667 2.66667H13.3333C14.0667 2.66667 14.6667 3.26667 14.6667 4V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66667C1.93333 13.3333 1.33333 12.7333 1.33333 12V4C1.33333 3.26667 1.93333 2.66667 2.66667 2.66667Z" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M14.6667 4L8 8.66667L1.33333 4" stroke="currentColor" stroke-width="1.2"/>
                  </svg>
                  Email
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input form-input-disabled"
                  disabled
                />
                <p class="form-hint">Email не может быть изменен</p>
              </div>

              <div class="form-group">
                <label class="form-label" for="phone">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14.6667 12.6667V14.6667C14.6667 15.0203 14.5262 15.3594 14.2761 15.6095C14.0261 15.8595 13.6869 16 13.3333 16C11.797 15.8387 10.3275 15.3051 9.04372 14.4446C7.83698 13.627 6.84884 12.5269 6.16667 11.2333C5.45801 9.89195 5.06606 8.39974 5.02667 6.87333C5.02442 6.52849 5.12463 6.19142 5.31331 5.90461C5.502 5.61781 5.77032 5.39372 6.08404 5.26006C6.39776 5.1264 6.74329 5.08902 7.07665 5.15236C7.41001 5.2157 7.7162 5.37741 7.96 5.62L9.68667 7.34667C9.92407 7.58155 10.0915 7.87806 10.1692 8.20278C10.2469 8.5275 10.2319 8.86705 10.126 9.18333C9.97858 9.59727 9.77773 9.98937 9.52933 10.3487C9.28093 10.708 8.98868 11.0302 8.66 11.3067C9.15132 12.107 9.79259 12.7936 10.5467 13.3267C11.2808 13.8355 12.1333 14.1495 13.0267 14.24C13.3539 14.271 13.6633 14.1111 13.8511 13.8237C14.0389 13.5364 14.0735 13.1724 13.9467 12.8533L13.9467 12.8533Z" stroke="currentColor" stroke-width="1.2"/>
                  </svg>
                  Телефон
                </label>
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
                  class="btn-primary"
                  :disabled="isLoading"
                >
                  <svg v-if="!isLoading" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13.5 2.25L15.75 4.5M6.75 15.75L2.25 14.25L3.75 9.75L12.75 0.75L17.25 5.25L8.25 14.25L6.75 15.75Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                  <div v-else class="spinner-small"></div>
                  {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
              </div>

              <transition name="alert">
                <div v-if="success" class="alert-success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span>Профиль успешно обновлен!</span>
                </div>
              </transition>
              
              <transition name="alert">
                <div v-if="error" class="alert-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span>{{ error }}</span>
                </div>
              </transition>
            </form>
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.8333 8.33333H4.16667C3.24619 8.33333 2.5 9.07952 2.5 10V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V10C17.5 9.07952 16.7538 8.33333 15.8333 8.33333Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M5.83333 8.33333V5C5.83333 3.89348 6.27232 2.83229 7.05372 2.05089C7.83512 1.26949 8.89631 0.830566 10.0028 0.830566C11.1094 0.830566 12.1706 1.26949 12.952 2.05089C13.7334 2.83229 14.1723 3.89348 14.1723 5V8.33333" stroke="currentColor" stroke-width="1.2"/>
                <circle cx="10" cy="12.9167" r="1.25" fill="currentColor"/>
              </svg>
            </div>
            <h2 class="card-title">Смена пароля</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword" class="password-form">
              
              <!-- Текущий пароль -->
              <div class="form-group">
                <label class="form-label" for="currentPassword">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.6667 6.66667H3.33333C2.59695 6.66667 2 7.26362 2 8V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V8C14 7.26362 13.403 6.66667 12.6667 6.66667Z" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M4.66667 6.66667V4C4.66667 3.11594 5.01786 2.2681 5.64298 1.64298C6.2681 1.01786 7.11594 0.666667 8 0.666667C8.88406 0.666667 9.7319 1.01786 10.357 1.64298C10.9821 2.2681 11.3333 3.11594 11.3333 4V6.66667" stroke="currentColor" stroke-width="1.2"/>
                    <circle cx="8" cy="10.3333" r="1" fill="currentColor"/>
                  </svg>
                  Текущий пароль
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Введите текущий пароль"
                    required
                  />
                  <button 
                    type="button"
                    class="password-toggle"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <svg v-if="!showCurrentPassword" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 3C3 3 1 9 1 9C1 9 3 15 9 15C15 15 17 9 17 9C17 9 15 3 9 3Z" stroke="currentColor" stroke-width="1.2"/>
                      <circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M1 1L17 17M6.7 6.7C6.3 7.1 6 7.7 6 8.5C6 10.2 7.3 11.5 9 11.5C9.8 11.5 10.4 11.2 10.8 10.8" stroke="currentColor" stroke-width="1.2"/>
                      <path d="M13.7 11.3C14.7 10.4 15.4 9.3 15.8 8.5C15.8 8.5 14.6 4 9 4C8.3 4 7.7 4.1 7.1 4.3M4.5 5.5C3.1 6.8 2.2 8.5 2.2 8.5C2.2 8.5 4 14 9 14C9.9 14 10.7 13.8 11.4 13.5" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Новый пароль -->
              <div class="form-group">
                <label class="form-label" for="newPassword">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.6667 6.66667H3.33333C2.59695 6.66667 2 7.26362 2 8V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V8C14 7.26362 13.403 6.66667 12.6667 6.66667Z" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M4.66667 6.66667V4C4.66667 3.11594 5.01786 2.2681 5.64298 1.64298C6.2681 1.01786 7.11594 0.666667 8 0.666667C8.88406 0.666667 9.7319 1.01786 10.357 1.64298C10.9821 2.2681 11.3333 3.11594 11.3333 4V6.66667" stroke="currentColor" stroke-width="1.2"/>
                    <circle cx="8" cy="10.3333" r="1" fill="currentColor"/>
                  </svg>
                  Новый пароль
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Минимум 8 символов"
                    required
                    minlength="8"
                  />
                  <button 
                    type="button"
                    class="password-toggle"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <svg v-if="!showNewPassword" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 3C3 3 1 9 1 9C1 9 3 15 9 15C15 15 17 9 17 9C17 9 15 3 9 3Z" stroke="currentColor" stroke-width="1.2"/>
                      <circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M1 1L17 17M6.7 6.7C6.3 7.1 6 7.7 6 8.5C6 10.2 7.3 11.5 9 11.5C9.8 11.5 10.4 11.2 10.8 10.8" stroke="currentColor" stroke-width="1.2"/>
                      <path d="M13.7 11.3C14.7 10.4 15.4 9.3 15.8 8.5C15.8 8.5 14.6 4 9 4C8.3 4 7.7 4.1 7.1 4.3M4.5 5.5C3.1 6.8 2.2 8.5 2.2 8.5C2.2 8.5 4 14 9 14C9.9 14 10.7 13.8 11.4 13.5" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                  </button>
                </div>
                <div class="password-strength" v-if="passwordForm.newPassword">
                  <div class="strength-bar" :class="passwordStrength"></div>
                  <span class="strength-text">{{ strengthText }}</span>
                </div>
              </div>

              <!-- Подтверждение пароля -->
              <div class="form-group">
                <label class="form-label" for="confirmPassword">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.6667 6.66667H3.33333C2.59695 6.66667 2 7.26362 2 8V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V8C14 7.26362 13.403 6.66667 12.6667 6.66667Z" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M4.66667 6.66667V4C4.66667 3.11594 5.01786 2.2681 5.64298 1.64298C6.2681 1.01786 7.11594 0.666667 8 0.666667C8.88406 0.666667 9.7319 1.01786 10.357 1.64298C10.9821 2.2681 11.3333 3.11594 11.3333 4V6.66667" stroke="currentColor" stroke-width="1.2"/>
                    <circle cx="8" cy="10.3333" r="1" fill="currentColor"/>
                    <path d="M10 8L6 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                  Подтвердите пароль
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Повторите новый пароль"
                    required
                  />
                  <button 
                    type="button"
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <svg v-if="!showConfirmPassword" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 3C3 3 1 9 1 9C1 9 3 15 9 15C15 15 17 9 17 9C17 9 15 3 9 3Z" stroke="currentColor" stroke-width="1.2"/>
                      <circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M1 1L17 17M6.7 6.7C6.3 7.1 6 7.7 6 8.5C6 10.2 7.3 11.5 9 11.5C9.8 11.5 10.4 11.2 10.8 10.8" stroke="currentColor" stroke-width="1.2"/>
                      <path d="M13.7 11.3C14.7 10.4 15.4 9.3 15.8 8.5C15.8 8.5 14.6 4 9 4C8.3 4 7.7 4.1 7.1 4.3M4.5 5.5C3.1 6.8 2.2 8.5 2.2 8.5C2.2 8.5 4 14 9 14C9.9 14 10.7 13.8 11.4 13.5" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                  </button>
                </div>
                <p v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="form-error">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M7 4V7.5M7 9.5H7.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                  Пароли не совпадают
                </p>
              </div>

              <!-- Кнопка отправки -->
              <div class="form-actions">
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="isPasswordLoading || passwordForm.newPassword !== passwordForm.confirmPassword"
                >
                  <svg v-if="!isPasswordLoading" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2.25V9.75M9 9.75L6.75 7.5M9 9.75L11.25 7.5M13.5 15.75H4.5C3.25736 15.75 2.25 14.7426 2.25 13.5V4.5C2.25 3.25736 3.25736 2.25 4.5 2.25H9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                  <div v-else class="spinner-small"></div>
                  {{ isPasswordLoading ? 'Смена...' : 'Сменить пароль' }}
                </button>
              </div>

              <!-- Сообщения об успехе/ошибке -->
              <transition name="alert">
                <div v-if="passwordSuccess" class="alert-success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span>Пароль успешно изменен!</span>
                </div>
              </transition>
              
              <transition name="alert">
                <div v-if="passwordError" class="alert-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span>{{ passwordError }}</span>
                </div>
              </transition>
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
const config = useRuntimeConfig();

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

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const isLoading = ref(false);
const success = ref(false);
const error = ref('');

const isPasswordLoading = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref('');

// Avatar upload state
const isAvatarUploading = ref(false);
const avatarError = ref('');

// Computed avatar URL with base API URL
const avatarUrl = computed(() => {
  if (!authStore.user?.avatar) return '';
  // If avatar is relative path (starts with /), prepend API base URL
  if (authStore.user.avatar.startsWith('/')) {
    // Get base URL without the /api suffix
    const baseUrl = config.public.apiUrl.replace(/\/api$/, '');
    return `${baseUrl}${authStore.user.avatar}`;
  }
  return authStore.user.avatar;
});

// Password strength calculation
const passwordStrength = computed(() => {
  const pwd = passwordForm.value.newPassword;
  if (!pwd) return '';
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

  if (strength <= 1) return 'weak';
  if (strength === 2) return 'medium';
  if (strength >= 3) return 'strong';
  return '';
});

const strengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return 'Слабый пароль';
    case 'medium': return 'Средний пароль';
    case 'strong': return 'Надежный пароль';
    default: return '';
  }
});

const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    avatarError.value = 'Допускаются только изображения (JPEG, PNG, GIF, WebP)';
    input.value = '';
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = 'Размер файла не должен превышать 5 МБ';
    input.value = '';
    return;
  }

  isAvatarUploading.value = true;
  avatarError.value = '';

  const result = await authStore.uploadAvatar(file);

  if (!result.success) {
    avatarError.value = result.error || 'Не удалось загрузить аватар';
  }

  isAvatarUploading.value = false;
  input.value = '';
};

const removeAvatar = async () => {
  if (!confirm('Вы уверены, что хотите удалить аватар?')) {
    return;
  }

  isAvatarUploading.value = true;
  avatarError.value = '';

  // Remove avatar by updating profile with null
  const result = await authStore.updateProfile({ avatar: null as any });

  if (!result.success) {
    avatarError.value = result.error || 'Не удалось удалить аватар';
  }

  isAvatarUploading.value = false;
};

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
    error.value = result.error || 'Не удалось обновить профиль';
  }

  isLoading.value = false;
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Пароли не совпадают';
    return;
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Пароль должен содержать минимум 8 символов';
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
    passwordError.value = result.error || 'Не удалось изменить пароль';
  }

  isPasswordLoading.value = false;
};

useHead({
  title: 'Настройки профиля - AirBorn',
});
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-link:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateX(-2px);
}

/* Grid Layout */
.profile-grid {
  display: grid;
  gap: 28px;
}

/* Cards */
.card {
  background: white;
  border-radius: 24px;
  border: 1px solid #eef2ff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 28px;
  border-bottom: 1px solid #f1f5f9;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.card-body {
  padding: 28px;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  flex-direction: column;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e2e8f0;
}

.avatar-initials {
  font-size: 36px;
  font-weight: 700;
  color: white;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  color: #ef4444;
  border: 1px solid #fee2e2;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  transform: translateY(-1px);
}

.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Forms */
.profile-form,
.password-form {
  display: flex;
  flex-direction: column;
  /* gap: 24px; */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.form-label svg {
  color: #3b82f6;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input-disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.form-error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

/* Password Input */
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
  color: #3b82f6;
}

/* Password Strength */
.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.strength-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
}

.strength-bar.weak::after {
  width: 33%;
  background: #ef4444;
}

.strength-bar.medium::after {
  width: 66%;
  background: #f59e0b;
}

.strength-bar.strong::after {
  width: 100%;
  background: #10b981;
}

.strength-text {
  font-size: 11px;
  color: #64748b;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 8px;
}

/* Alerts */
.alert-success,
.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
}

.alert-success svg {
  color: #10b981;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

.alert-error svg {
  color: #ef4444;
}

/* Spinner */
.spinner,
.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.spinner {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alert Animation */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .card-header {
    padding: 20px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .avatar-container {
    width: 100px;
    height: 100px;
  }
  
  .avatar-initials {
    font-size: 28px;
  }
  
  .avatar-actions {
    width: 100%;
  }
  
  .btn-secondary,
  .btn-outline {
    width: 100%;
  }
  
  .form-actions button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>