<template>
  <div class="layout-public-auth">
    <!-- Header -->
    <header class="header">
      <nav class="navbar container">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">✈</span>
          <span class="logo-text">AirBorn</span>
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">Главная</NuxtLink>
          <NuxtLink to="/projects" class="nav-link">Проекты</NuxtLink>
          <NuxtLink to="/#contacts" class="nav-link">Контакты</NuxtLink>
        </div>

        <div class="auth-buttons">
          <NuxtLink to="/login" class="btn btn-outline btn-sm">Войти</NuxtLink>
          <NuxtLink to="/register" class="btn btn-primary btn-sm">Регистрация</NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>AirBorn</h4>
            <p>Инновационные решения для современного бизнеса</p>
          </div>
          <div class="footer-section">
            <h4>Быстрые ссылки</h4>
            <ul>
              <li><NuxtLink to="/">Главная</NuxtLink></li>
              <li><NuxtLink to="/projects">Проекты</NuxtLink></li>
              <li><NuxtLink to="/login">Войти</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Контакты</h4>
            <ul>
              <li>info@airborn.com</li>
              <li>+7 (999) 123-45-67</li>
              <li>Москва, Россия</li>
            </ul>
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
// Layout for public auth-related pages (verify-email, under-construction)
</script>

<style scoped>
.layout-public-auth {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
}

.logo-icon {
  font-size: 24px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #3b82f6;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-outline {
  background: transparent;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.footer {
  background: #0f172a;
  color: #94a3b8;
  padding: 48px 0 24px;
  margin-top: auto;
}

.footer .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.footer-section h4 {
  color: #f1f5f9;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 8px;
  font-size: 14px;
}

.footer-section a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: #f1f5f9;
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
    flex-wrap: wrap;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    gap: 16px;
  }

  .nav-link {
    font-size: 13px;
  }

  .auth-buttons {
    margin-left: auto;
  }

  .footer .container {
    padding: 0 20px;
  }

  .footer-content {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .auth-buttons {
    display: none;
  }

  .logo-text {
    font-size: 18px;
  }
}
</style>
