<template>
  <div class="layout-default">
    <!-- Header -->
    <header class="header">
      <nav class="navbar container">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">✈</span>
          <span class="logo-text">AirBorn</span>
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/projects" class="nav-link">Projects</NuxtLink>
          <NuxtLink to="/#contacts" class="nav-link">Contacts</NuxtLink>
        </div>

        <div class="auth-buttons">
          <NuxtLink to="/login" class="btn btn-outline btn-sm">Login</NuxtLink>
          <NuxtLink to="/register" class="btn btn-primary btn-sm">Sign Up</NuxtLink>
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
            <p>Innovative solutions for modern businesses</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><NuxtLink to="/">Home</NuxtLink></li>
              <li><NuxtLink to="/projects">Projects</NuxtLink></li>
              <li><NuxtLink to="/login">Login</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>info@airborn.com</li>
              <li>+7 (999) 123-45-67</li>
              <li>Moscow, Russia</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} AirBorn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Default layout for public pages
</script>

<style scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-sm);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

.logo-icon {
  font-size: 1.5em;
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-primary);
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.main-content {
  flex: 1;
}

.footer {
  background-color: var(--color-bg-dark);
  color: var(--color-text-inverse);
  padding: var(--spacing-2xl) 0 var(--spacing-lg);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-section h4 {
  color: var(--color-text-inverse);
  margin-bottom: var(--spacing-md);
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: var(--spacing-sm);
}

.footer-section a {
  color: var(--color-text-light);
  text-decoration: none;
}

.footer-section a:hover {
  color: var(--color-text-inverse);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
  }

  .auth-buttons {
    margin-left: auto;
  }
}
</style>
