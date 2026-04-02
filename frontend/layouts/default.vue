<template>
  <div class="layout-default">
    <!-- Preloader -->
    <Preloader :isLoading="isLoading" />

    <!-- Header -->
    <header class="header" :class="{ 'header-scrolled': isScrolled }">
      <div class="container">
        <div class="header-inner">
          <NuxtLink to="/">
            <div class="logo">
              <div class="logo-mark">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L4 12L16 20L28 12L16 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  <path d="M4 20L16 28L28 20" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  <circle cx="16" cy="12" r="2" fill="currentColor"/>
                </svg>
              </div>
              <span class="logo-text">AirBorn</span>
            </div>
          </NuxtLink>

          
          <nav class="nav">
            <NuxtLink to="/#services" class="nav-link">Услуги</NuxtLink>
            <NuxtLink to="/#process" class="nav-link">Процесс</NuxtLink>
            <NuxtLink to="/#contact-form" class="nav-link">Контакты</NuxtLink>
          </nav>

          <div class="header-actions">
            <a href="tel:+79650212288" class="phone">+7 (965) 021-22-88</a>
            <button @click="scrollToForm" class="btn-primary-small">
              Заказать звонок
            </button>
            <NuxtLink to="/login" class="btn-login">Вход</NuxtLink>
          </div>

          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="mobile-menu" :class="{ 'mobile-menu-open': mobileMenuOpen }">
        <button class="mobile-menu-close" @click="closeMobileMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <a href="#services" class="mobile-nav-link" @click="closeMobileMenu">Услуги</a>
        <a href="#process" class="mobile-nav-link" @click="closeMobileMenu">Процесс</a>
        <a href="#contacts" class="mobile-nav-link" @click="closeMobileMenu">Контакты</a>
        <NuxtLink to="/login" class="mobile-nav-link" @click="closeMobileMenu">Вход</NuxtLink>
        <button @click="scrollToForm" class="btn-primary-full">Оставить заявку</button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="logo-mark">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L4 12L16 20L28 12L16 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M4 20L16 28L28 20" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
            <span class="logo-text">AirBorn</span>
            <p class="footer-desc">Профессиональный монтаж систем вентиляции и кондиционирования в Санкт-Петербурге</p>
          </div>

          <div class="footer-links">
            <div class="footer-column">
              <h4>Услуги</h4>
              <NuxtLink to="/under-construction" class="footer-link">Кондиционирование</NuxtLink>
              <NuxtLink to="/under-construction" class="footer-link">Вентиляция</NuxtLink>
              <NuxtLink to="/under-construction" class="footer-link">Обслуживание</NuxtLink>
            </div>
            <div class="footer-column">
              <h4>Компания</h4>
              <NuxtLink to="/under-construction" class="footer-link">О нас</NuxtLink>
              <NuxtLink to="/under-construction" class="footer-link">Проекты</NuxtLink>
              <NuxtLink to="/under-construction" class="footer-link">Отзывы</NuxtLink>
            </div>
            <div class="footer-column">
              <h4>Правовая информация</h4>
              <NuxtLink to="/under-construction" class="footer-link">Политика конфиденциальности</NuxtLink>
              <NuxtLink to="/under-construction" class="footer-link">Договор оферты</NuxtLink>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} AirBorn. Все права защищены.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
const isLoading = ref(true);
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const scrollToForm = () => {
  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  mobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : '';
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : '';
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);

  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50;
  });
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  padding: 0;
  margin: 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
}

.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  z-index: 1000;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-bottom-color: transparent;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  transition: height 0.3s ease;
}

.header-scrolled .header-inner {
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-mark {
  color: #2563eb;
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


@media (max-width: 433px) {
  .logo-text {
    display: none;
  }
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #2563eb;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.phone {
  text-decoration: none;
  color: #1e293b;
  font-weight: 600;
  font-size: 16px;
}

.btn-primary-small {
  padding: 8px 20px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-small:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-login {
  padding: 3px 14px;
  background: transparent;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-login:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background: #1e293b;
  transition: all 0.3s ease;
}

.mobile-menu-btn.open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.open span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.open span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
  height: 100vh;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: #ffffff;
  padding: 80px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 999;
  overflow-y: auto;
  height: 100vh;
}

.mobile-menu-open {
  transform: translateX(0);
}

.mobile-menu-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #475569;
  transition: color 0.3s ease;
}

.mobile-menu-close:hover {
  color: #2563eb;
}

.mobile-nav-link {
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 16px;
}

.btn-primary-full {
  padding: 14px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  font-size: 15px;
  margin-top: auto;
}

@media (max-width: 865px) {
  .nav, .phone {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .header-actions {
    gap: 12px;
  }
}

/* Footer */
.footer {
  background: #0f172a;
  padding: 64px 0 32px;
  color: white;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  margin-bottom: 48px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-brand .logo-mark {
  color: #2563eb;
}

.footer-brand .logo-text {
  font-size: 24px;
  font-weight: 700;
  color: white;
  background: none;
  -webkit-text-fill-color: white;
}

.footer-desc {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 300px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-column h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
}

.footer-column a {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #2563eb;
}

.footer-bottom {
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 32px;
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


