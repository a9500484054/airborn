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
        <div>
          <div class="mobile-menu-header">
            <div class="mobile-logo">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L4 12L16 20L28 12L16 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M4 20L16 28L28 20" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <circle cx="16" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <span class="mobile-logo-text">AirBorn</span>
          </div>
          <button class="mobile-menu-close" @click="closeMobileMenu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        

        
        <a href="tel:+79650212288" class="mobile-phone">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18.3334 14.0833V16.5C18.334 16.789 18.2653 17.074 18.1335 17.3299C18.0018 17.5858 17.811 17.8049 17.5778 17.9692C17.3446 18.1336 17.076 18.2385 16.7946 18.2757C16.5133 18.3128 16.2276 18.2813 15.9584 18.1833C13.0719 17.2007 10.4706 15.5151 8.39166 13.275C6.17864 11.1732 4.50927 8.56192 3.54166 5.65833C3.44587 5.39193 3.4151 5.10596 3.45193 4.82516C3.48876 4.54436 3.59218 4.27618 3.75444 4.04296C3.91669 3.80973 4.13316 3.61808 4.38624 3.48471C4.63933 3.35134 4.92166 3.28023 5.20833 3.27708H7.625C7.958 3.27518 8.28134 3.37946 8.54855 3.57425C8.81576 3.76904 9.0134 4.04403 9.1125 4.35833C9.30618 4.99811 9.57218 5.61353 9.90417 6.19167C10.0825 6.50452 10.1658 6.86214 10.1445 7.22062C10.1232 7.57909 9.99833 7.92375 9.7875 8.2125L8.85417 9.4375C9.9669 11.3462 11.5675 12.8609 13.5125 13.8542L14.7625 12.9583C15.0492 12.7546 15.3903 12.6338 15.744 12.6117C16.0977 12.5897 16.4504 12.6672 16.7583 12.8354C17.3499 13.1689 17.974 13.4468 18.625 13.6667C18.9435 13.7671 19.2214 13.9669 19.4167 14.2372C19.612 14.5075 19.7145 14.8345 19.7083 15.1688V18.3333H19.7083Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          +7 (965) 021-22-88
        </a>
        
        <div class="mobile-menu-divider"></div>
        
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
  padding: 24px;
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

.mobile-menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 10px;
}

.mobile-logo {
  color: #2563eb;
  display: flex;
  align-items: center;
}

.mobile-logo-text {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mobile-phone {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 12px;
  text-decoration: none;
  color: #1e293b;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.mobile-phone:hover {
  background: #f1f5f9;
  color: #2563eb;
}

.mobile-phone svg {
  color: #2563eb;
}

.mobile-menu-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 8px 0;
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


