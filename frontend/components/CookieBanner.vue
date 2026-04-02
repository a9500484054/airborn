<template>
  <transition name="slide-up">
    <div v-if="showBanner" class="cookie-banner">
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 7V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p>
            Мы используем файлы cookie для улучшения работы сайта. 
            Продолжая использовать сайт, вы соглашаетесь с нашей 
            <NuxtLink to="/under-construction" class="cookie-link">политикой конфиденциальности</NuxtLink>.
          </p>
        </div>
        <button class="cookie-accept-btn" @click="acceptCookies">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Принять
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const showBanner = ref(false);

onMounted(() => {
  const cookiesAccepted = localStorage.getItem('cookies_accepted');
  
  setTimeout(() => {
    if (!cookiesAccepted) {
      showBanner.value = true;
    }
  }, 1000);
});

const acceptCookies = () => {
  localStorage.setItem('cookies_accepted', 'true');
  showBanner.value = false;
};
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  padding: 20px 24px;
}

.cookie-banner-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.cookie-banner-text {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
}

.cookie-banner-text svg {
  color: #2563eb;
  flex-shrink: 0;
}

.cookie-banner-text p {
  margin: 0;
}

.cookie-link {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.cookie-link:hover {
  color: #3b82f6;
}

.cookie-accept-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.cookie-accept-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.cookie-accept-btn svg {
  color: white;
}

/* Slide Up Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .cookie-banner {
    padding: 16px 20px;
  }

  .cookie-banner-content {
    flex-direction: column;
    gap: 16px;
  }

  .cookie-banner-text {
    font-size: 13px;
  }

  .cookie-accept-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
