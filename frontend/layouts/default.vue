<template>
  <div class="layout-default">
    <!-- Header -->
    <div v-if="isLoading" class="preloader">
      <div class="preloader-content">
        <div class="preloader-ring"></div>
        <p class="preloader-text">AirBorn</p>
      </div>
    </div>

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
            <a href="tel:+78121234567" class="phone">+7 (812) 123-45-67</a>
            <button @click="scrollToForm" class="btn-primary-small">
              Заказать звонок
            </button>
            <NuxtLink to="/login" class="btn-login">Вход</NuxtLink>
          </div>

          <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <a href="#services" class="mobile-nav-link">Услуги</a>
        <a href="#process" class="mobile-nav-link">Процесс</a>
        <a href="#contacts" class="mobile-nav-link">Контакты</a>
        <NuxtLink to="/login" class="mobile-nav-link">Вход</NuxtLink>
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
              <a href="#">Кондиционирование</a>
              <a href="#">Вентиляция</a>
              <a href="#">Обслуживание</a>
            </div>
            <div class="footer-column">
              <h4>Компания</h4>
              <a href="#">О нас</a>
              <a href="#">Проекты</a>
              <a href="#">Отзывы</a>
            </div>
            <div class="footer-column">
              <h4>Правовая информация</h4>
              <a href="#">Политика конфиденциальности</a>
              <a href="#">Договор оферты</a>
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
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  z-index: 1000;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
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
  padding: 8px 20px;
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

.mobile-menu {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
}

.mobile-nav-link {
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.btn-primary-full {
  padding: 12px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
}

@media (max-width: 1024px) {
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


