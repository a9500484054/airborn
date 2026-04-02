<template>
  <div class="landing-page">

    <NuxtLayout>
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg">
          <div class="hero-gradient"></div>
          <div class="hero-particles"></div>
        </div>
        
        <div class="container">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-dot"></span>
              Работаем в СПб и Ленобласти
            </div>
            
            <h1 class="hero-title">
              Профессиональный монтаж
              <span class="title-gradient">вентиляции и кондиционирования</span>
            </h1>
            
            <p class="hero-description">
              Монтируем системы «под ключ» с гарантией 12 месяцев. 
              Бесплатный выезд инженера в день обращения.
            </p>
            
            <div class="hero-stats">
              <div class="stat">
                <div class="stat-number">500+</div>
                <div class="stat-label">Выполненных проектов</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <div class="stat-number">12 лет</div>
                <div class="stat-label">Опыта на рынке</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Техподдержка</div>
              </div>
            </div>
            
            <div class="hero-actions">
              <button @click="scrollToForm" class="btn-primary-hero">
                Рассчитать стоимость
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
              <a href="tel:+79650212288" class="btn-outline-hero">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.3334 14.0833V16.5C18.334 16.789 18.2653 17.074 18.1335 17.3299C18.0018 17.5858 17.811 17.8049 17.5778 17.9692C17.3446 18.1336 17.076 18.2385 16.7946 18.2757C16.5133 18.3128 16.2276 18.2813 15.9584 18.1833C13.0719 17.2007 10.4706 15.5151 8.39166 13.275C6.17864 11.1732 4.50927 8.56192 3.54166 5.65833C3.44587 5.39193 3.4151 5.10596 3.45193 4.82516C3.48876 4.54436 3.59218 4.27618 3.75444 4.04296C3.91669 3.80973 4.13316 3.61808 4.38624 3.48471C4.63933 3.35134 4.92166 3.28023 5.20833 3.27708H7.625C7.958 3.27518 8.28134 3.37946 8.54855 3.57425C8.81576 3.76904 9.0134 4.04403 9.1125 4.35833C9.30618 4.99811 9.57218 5.61353 9.90417 6.19167C10.0825 6.50452 10.1658 6.86214 10.1445 7.22062C10.1232 7.57909 9.99833 7.92375 9.7875 8.2125L8.85417 9.4375C9.9669 11.3462 11.5675 12.8609 13.5125 13.8542L14.7625 12.9583C15.0492 12.7546 15.3903 12.6338 15.744 12.6117C16.0977 12.5897 16.4504 12.6672 16.7583 12.8354C17.3499 13.1689 17.974 13.4468 18.625 13.6667C18.9435 13.7671 19.2214 13.9669 19.4167 14.2372C19.612 14.5075 19.7145 14.8345 19.7083 15.1688V18.3333H19.7083Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="services">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Что мы делаем</span>
            <h2 class="section-title">Комплексные решения<br>для вашего комфорта</h2>
          </div>

          <div class="services-grid">
            <div class="service-card" v-for="service in services" :key="service.title">
              <div class="service-icon">{{ service.icon }}</div>
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-desc">{{ service.desc }}</p>
              <ul class="service-list">
                <li v-for="item in service.items" :key="item">• {{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Advantages Section -->
      <section class="advantages">
        <div class="container">
          <div class="advantages-grid">
            <div class="advantage-item" v-for="advantage in advantages" :key="advantage.title">
              <div class="advantage-number">{{ advantage.number }}</div>
              <h3 class="advantage-title">{{ advantage.title }}</h3>
              <p class="advantage-desc">{{ advantage.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Process Section -->
      <section id="process" class="process">
        <div class="container">
          <div class="section-header center">
            <span class="section-badge">Как мы работаем</span>
            <h2 class="section-title">Прозрачный процесс<br>от заявки до результата</h2>
          </div>

          <div class="process-steps">
            <div class="step" v-for="(step, index) in steps" :key="index">
              <div class="step-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="step-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
              <div v-if="index < steps.length - 1" class="step-line"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <div class="cta-card">
            <div class="cta-content">
              <h2 class="cta-title">Нужен расчет стоимости?</h2>
              <p class="cta-desc">Оставьте заявку и получите бесплатный выезд инженера в день обращения</p>
              <button @click="scrollToForm" class="btn-primary-cta">
                Оставить заявку
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="cta-stats">
              <div class="cta-stat">
                <div class="cta-stat-value">15 мин</div>
                <div class="cta-stat-label">Среднее время ответа</div>
              </div>
              <div class="cta-stat">
                <div class="cta-stat-value">24/7</div>
                <div class="cta-stat-label">Техническая поддержка</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section id="contact-form" class="contact-form">
        <div class="container">
          <div class="form-grid">
            <div class="form-info">
              <div class="section-badge">Свяжитесь с нами</div>
              <h2 class="form-title">Остались вопросы?</h2>
              <p class="form-desc">Наш специалист свяжется с вами в ближайшее время и ответит на все вопросы</p>
              
              <div class="contact-info">
                <div class="contact-info-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.352 21.4019C21.1467 21.5901 20.9041 21.7335 20.6408 21.8227C20.3775 21.9119 20.0994 21.9451 19.823 21.92C16.7427 21.5856 13.787 20.5341 11.19 18.85C8.7738 17.3147 6.72533 15.2662 5.19 12.85C3.4999 10.2412 2.44809 7.27179 2.12 4.18C2.09497 3.90347 2.12814 3.62521 2.2173 3.36171C2.30647 3.09822 2.44984 2.8554 2.63809 2.64994C2.82633 2.44448 3.05551 2.28073 3.31079 2.1691C3.56607 2.05746 3.84184 2.0005 4.12041 2.00195H7.12041C7.5448 1.9984 7.9582 2.13063 8.30104 2.3793C8.64389 2.62798 8.89779 2.97992 9.02041 3.38195C9.20463 4.02366 9.45668 4.64425 9.77041 5.23195C9.94928 5.54851 10.0299 5.90889 10.004 6.26882C9.97807 6.62875 9.84659 6.97505 9.625 7.26595L8.655 8.51195C9.81542 10.4413 11.4456 12.0303 13.405 13.1419L14.665 12.2069C14.9546 11.9878 15.2987 11.8579 15.6567 11.8315C16.0148 11.8051 16.3735 11.8832 16.69 12.0579C17.2836 12.3694 17.9099 12.6193 18.557 12.8029C18.9632 12.9246 19.319 13.179 19.5705 13.5254C19.822 13.8718 19.9554 14.2906 19.951 14.7189V17.7189C19.951 18.1133 19.8365 18.4989 19.6221 18.8286C19.4076 19.1584 19.1026 19.4179 18.743 19.5759C18.4191 19.7179 18.069 19.7943 17.715 19.801C17.362 19.8076 17.01 19.745 16.68 19.6169" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <div>
                    <strong>Телефон</strong>
                    <a href="tel:+79650212288">+7 (965) 021-22-88</a>
                  </div>
                </div>
                <div class="contact-info-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:airborn.online@yandex.ru">airborn.online@yandex.ru</a>
                  </div>
                </div>
                <div class="contact-info-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 13.17 9.42 18.92 11.24 21.11C11.64 21.59 12.37 21.59 12.77 21.11C14.58 18.92 19 13.17 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <div>
                    <strong>Адрес</strong>
                    <p>198302, Санкт-Петербург, пр. Стачек, 99, лит. А</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-wrapper">
              <form @submit.prevent="submitForm" class="form">
                <div class="form-group">
                  <input type="text" v-model="form.name" placeholder="Ваше имя" required>
                </div>
                <div class="form-group">
                  <input 
                    type="tel" 
                    v-model="form.phone" 
                    @input="formatPhone"
                    placeholder="+7 (___) ___-__-__" 
                    required
                    class="form-input-phone"
                  >
                </div>
                <div class="form-group">
                  <textarea 
                    v-model="form.comment" 
                    placeholder="Опишите вашу задачу или вопрос"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="btn-submit" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
                </button>
                
                <div v-if="formSuccess" class="alert-success">
                  ✅ Спасибо! Мы свяжемся с вами
                </div>
                <div v-if="formError" class="alert-error">
                  ❌ {{ formError }}
                </div>
                
                <p class="form-note">
                  Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'AirBorn | Монтаж вентиляции и кондиционирования в СПб',
  meta: [
    { name: 'description', content: 'Профессиональный монтаж систем вентиляции и кондиционирования в Санкт-Петербурге. Гарантия 12 месяцев. Бесплатный выезд инженера.' }
  ]
});

const isSubmitting = ref(false);
const formSuccess = ref(false);
const formError = ref('');

const form = ref({
  name: '',
  phone: '',
  service: ''
});

const services = [
  {
    icon: '❄️',
    title: 'Сплит-системы',
    desc: 'Идеальное решение для квартир и небольших офисов',
    items: ['Монтаж за 2-4 часа', 'Пуско-наладка в подарок', 'Гарантия 12 месяцев']
  },
  {
    icon: '🏢',
    title: 'VRV/VRF системы',
    desc: 'Централизованное кондиционирование для больших объектов',
    items: ['До 50 внутренних блоков', 'Энергоэффективность A+++', 'Индивидуальный климат']
  },
  {
    icon: '💨',
    title: 'Вентиляция',
    desc: 'Приточно-вытяжные системы с рекуперацией тепла',
    items: ['Фильтрация воздуха', 'Тихая работа', 'Экономия до 40% тепла']
  }
];

const advantages = [
  { number: '01', title: 'Гарантия 12 месяцев', desc: 'На все виды работ и оборудование' },
  { number: '02', title: 'Бесплатный выезд', desc: 'Инженер приедет в день обращения' },
  // { number: '03', title: 'Оплата по факту', desc: 'Только после полного завершения работ' },
  { number: '03', title: 'Соблюдение СНиП', desc: 'Все работы по ГОСТ и нормативам' }
];

const steps = [
  { title: 'Оставьте заявку', desc: 'Заполните форму или позвоните нам. Консультация бесплатно' },
  { title: 'Выезд инженера', desc: 'Бесплатный замер и расчет сметы на объекте' },
  { title: 'Заключение договора', desc: 'Фиксация сроков, стоимости и всех условий' },
  { title: 'Монтаж и оплата', desc: 'Профессиональная установка. Оплата после приемки' }
];

const config = useRuntimeConfig();

const scrollToForm = () => {
  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
};

const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length === 0) {
    input.value = '';
    return;
  }
  
  if (value[0] === '7' || value[0] === '8') {
    value = value.slice(1);
  }
  
  if (value.length > 10) {
    value = value.slice(0, 10);
  }
  
  let formatted = '+7';
  
  if (value.length > 0) {
    formatted += ' (' + value.slice(0, 3);
  }
  if (value.length > 3) {
    formatted += ') ' + value.slice(3, 6);
  }
  if (value.length > 6) {
    formatted += '-' + value.slice(6, 8);
  }
  if (value.length > 8) {
    formatted += '-' + value.slice(8, 10);
  }
  
  input.value = formatted;
  form.value.phone = formatted;
};

function formatPhoneNumber(phone:string): string {
    // Удаляем все символы, кроме цифр
    const digits = phone.replace(/\D/g, '');
    return `+${digits}`;
}

const submitForm = async () => {
  isSubmitting.value = true;
  formError.value = '';
  formSuccess.value = false;

  try {
    const { data, error } = await useFetch(`${config.public.apiUrl}/leads`, {
      method: 'POST',
      body: {
        name: form.value.name,
        phone: formatPhoneNumber(form.value.phone),
        comment: form.value.service ? `Услуга: ${form.value.service}` : ''
      }
    });

    if (error.value) {
      formError.value = error.value.data?.error?.message || 'Ошибка при отправке заявки';
      return;
    }

    if (data.value) {
      formSuccess.value = true;
      form.value = { name: '', phone: '', service: '' };
    }
  } catch (err) {
    formError.value = 'Произошла ошибка. Попробуйте позже.';
  } finally {
    isSubmitting.value = false;
  }
};
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

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #ffffff;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(37, 99, 235, 0.03) 0%, transparent 50%);
}

.hero-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(37, 99, 235, 0.1) 1px, transparent 0);
  background-size: 40px 40px;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 120px 0 80px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: #f1f5f9;
  border-radius: 100px;
  font-size: 14px;
  color: #475569;
  margin-bottom: 32px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  color: #0f172a;
  margin-bottom: 24px;
}



.title-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
}

.hero-description {
  font-size: 18px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 48px;
  max-width: 600px;
}

.hero-stats {
  display: flex;
  gap: 48px;
  margin-bottom: 48px;
}
@media (max-width: 433px) {
  .hero-stats {
    display: flex;
    flex-direction: column;
  }
}

.stat {
  text-align: left;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  background: #e2e8f0;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-hero:hover {
  background: #2563eb;
  transform: translateY(-2px);
  gap: 16px;
}

.btn-outline-hero {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: transparent;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline-hero:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-stats {
    gap: 24px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .btn-primary-hero, .btn-outline-hero {
    justify-content: center;
  }
}

@media (max-width: 433px) {
  .hero-title {
    font-size: 28px;
  }

}

/* Services Section */
.services {
  padding: 100px 0;
  background: #ffffff;
}

.section-header {
  margin-bottom: 64px;
}

.section-header.center {
  text-align: center;
}

.section-badge {
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.service-card {
  padding: 40px 32px;
  background: #ffffff;
  border: 1px solid #eef2ff;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: #2563eb;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}

.service-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.service-title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.service-desc {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.service-list {
  list-style: none;
  padding: 0;
}

.service-list li {
  color: #475569;
  font-size: 14px;
  padding: 6px 0;
}

/* Advantages Section */
.advantages {
  padding: 80px 0;
  background: #f8fafc;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 48px;
}

.advantage-item {
  text-align: center;
}

.advantage-number {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}

.advantage-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.advantage-desc {
  color: #64748b;
  line-height: 1.6;
}

/* Process Section */
.process {
  padding: 100px 0;
  background: #ffffff;
}

.process-steps {
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  gap: 32px;
  position: relative;
  padding-bottom: 48px;
}

.step:last-child {
  padding-bottom: 0;
}

.step-number {
  font-size: 32px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: monospace;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.step-desc {
  color: #64748b;
  line-height: 1.6;
}

.step-line {
  position: absolute;
  left: 46px;
  top: 48px;
  bottom: -24px;
  width: 1px;
  background: #e2e8f0;
}

.step:last-child .step-line {
  display: none;
}

/* CTA Section */
.cta {
  padding: 80px 0;
  background: #f8fafc;
}

.cta-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 32px;
  padding: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
}

.cta-content {
  flex: 1;
}

.cta-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.cta-desc {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  line-height: 1.6;
}

.btn-primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-cta:hover {
  background: #3b82f6;
  transform: translateY(-2px);
  gap: 16px;
}

.cta-stats {
  display: flex;
  gap: 48px;
}

.cta-stat {
  text-align: center;
}

.cta-stat-value {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}
@media (max-width: 433px) {
  .cta-stat-value {
    font-size: 26px
  }
}


.cta-stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .cta-card {
    padding: 40px;
  }
  
  .cta-stats {
    width: 100%;
    justify-content: space-between;
  }
}

/* Contact Form */
.contact-form {
  padding: 100px 0;
  background: #ffffff;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}

.form-info {
  padding-right: 32px;
}

.form-title {
  font-size: 36px;
  font-weight: 700;
  color: #0f172a;
  margin: 16px 0 24px;
}

.form-desc {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 48px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.contact-info-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.contact-info-item svg {
  width: 24px;
  height: 24px;
  color: #2563eb;
  flex-shrink: 0;
}

.contact-info-item strong {
  display: block;
  color: #0f172a;
  margin-bottom: 4px;
  font-size: 14px;
}

.contact-info-item a, .contact-info-item p {
  color: #475569;
  text-decoration: none;
  font-size: 16px;
}

.contact-info-item a:hover {
  color: #2563eb;
}

.form-wrapper {
  background: #f8fafc;
  padding: 48px;
  border-radius: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-submit {
  padding: 14px 32px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.form-note {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  margin-top: 8px;
}

.alert-success,
.alert-error {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  
  .form-info {
    padding-right: 0;
  }
}

@media (max-width: 768px) {
  .form-wrapper {
    padding: 32px;
  }
  
  .form-title {
    font-size: 28px;
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

.footer-brand .logo-mark {
  color: #2563eb;
  margin-bottom: 16px;
}

.footer-brand .logo-text {
  font-size: 24px;
  font-weight: 700;
  display: block;
  margin-bottom: 16px;
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
</style>