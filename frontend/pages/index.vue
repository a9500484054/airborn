<template>
  <NuxtLayout>
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container hero-content">
          <h1 class="hero-title">
            Building the Future,
            <span class="text-primary">One Project at a Time</span>
          </h1>
          <p class="hero-subtitle">
            AirBorn delivers innovative solutions and cutting-edge technology 
            to transform your vision into reality.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/register" class="btn btn-primary btn-lg">
              Get Started
            </NuxtLink>
            <NuxtLink to="/projects" class="btn btn-outline btn-lg">
              View Projects
            </NuxtLink>
          </div>
        </div>
        <div class="hero-bg"></div>
      </section>

      <!-- About Section -->
      <section class="about section">
        <div class="container">
          <div class="section-header">
            <h2>About AirBorn</h2>
            <p class="section-subtitle">
              We are a team of passionate professionals dedicated to excellence
            </p>
          </div>
          <div class="about-grid">
            <div class="about-card">
              <div class="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To deliver exceptional solutions that exceed expectations and drive 
                business growth through innovation and expertise.
              </p>
            </div>
            <div class="about-card">
              <div class="card-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                To be the leading partner for businesses seeking transformative 
                solutions and sustainable success.
              </p>
            </div>
            <div class="about-card">
              <div class="card-icon">⭐</div>
              <h3>Our Values</h3>
              <p>
                Integrity, excellence, innovation, and customer focus guide 
                everything we do.
              </p>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">150+</div>
              <div class="stat-label">Projects Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">Happy Clients</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">10+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Preview -->
      <section class="projects-preview section">
        <div class="container">
          <div class="section-header">
            <h2>Featured Projects</h2>
            <p class="section-subtitle">
              Explore our portfolio of successful projects
            </p>
          </div>
          <div class="projects-grid">
            <div
              v-for="project in projectsStore.projects.slice(0, 3)"
              :key="project.id"
              class="project-card"
            >
              <div class="project-image">
                <img
                  v-if="project.images?.[0]"
                  :src="project.images[0]"
                  :alt="project.title"
                  loading="lazy"
                />
                <div v-else class="project-image-placeholder">
                  📁
                </div>
              </div>
              <div class="project-content">
                <h3>{{ project.title }}</h3>
                <p>{{ project.shortDescription }}</p>
                <NuxtLink :to="`/projects/${project.id}`" class="btn btn-outline btn-sm">
                  Learn More →
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="text-center mt-xl">
            <NuxtLink to="/projects" class="btn btn-primary btn-lg">
              View All Projects
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contacts" class="contact section">
        <div class="container">
          <div class="section-header">
            <h2>Get In Touch</h2>
            <p class="section-subtitle">
              Ready to start your project? Contact us today!
            </p>
          </div>
          <div class="contact-grid">
            <div class="contact-info">
              <div class="info-item">
                <div class="info-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>Moscow, Russia</p>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+7 (999) 123-45-67</p>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@airborn.com</p>
                </div>
              </div>
            </div>
            <div class="contact-form-wrapper">
              <form @submit.prevent="submitForm" class="contact-form">
                <div class="form-group">
                  <label class="form-label" for="name">Full Name *</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label" for="phone">Phone *</label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label" for="email">Email *</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label" for="comment">Comment</label>
                  <textarea
                    id="comment"
                    v-model="form.comment"
                    class="form-textarea"
                    placeholder="Tell us about your project..."
                    rows="4"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>
                <div v-if="formSuccess" class="alert alert-success mt-md">
                  Thank you! We'll contact you soon.
                </div>
                <div v-if="formError" class="alert alert-error mt-md">
                  {{ formError }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const projectsStore = useProjectsStore();
const config = useRuntimeConfig();

// Form state
const form = ref({
  name: '',
  phone: '',
  email: '',
  comment: '',
});
const isSubmitting = ref(false);
const formSuccess = ref(false);
const formError = ref('');

// Load projects on mount
onMounted(async () => {
  await projectsStore.loadProjects(1);
});

// Submit contact form
const submitForm = async () => {
  isSubmitting.value = true;
  formError.value = '';
  formSuccess.value = false;

  try {
    const { data } = await useFetch(`${config.public.apiUrl}/leads`, {
      method: 'POST',
      body: form.value,
    });

    if (data.value) {
      formSuccess.value = true;
      form.value = { name: '', phone: '', email: '', comment: '' };
    }
  } catch (error: any) {
    formError.value = error.data?.error?.message || 'Failed to send message';
  } finally {
    isSubmitting.value = false;
  }
};

// Page metadata
useHead({
  title: 'AirBorn - Innovative Solutions for Modern Business',
  meta: [
    { name: 'description', content: 'AirBorn delivers innovative solutions and cutting-edge technology to transform your vision into reality.' },
  ],
});
</script>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

.section {
  padding: var(--spacing-2xl) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.section-header h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-sm);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--spacing-lg);
}

.hero-title .text-primary {
  color: var(--color-accent);
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  opacity: 0.9;
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

/* About Section */
.about {
  background-color: var(--color-bg-primary);
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.about-card {
  text-align: center;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-secondary);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.about-card h3 {
  margin-bottom: var(--spacing-sm);
}

.about-card p {
  color: var(--color-text-secondary);
  margin-bottom: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-radius: var(--radius-lg);
  color: white;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

/* Projects Preview */
.projects-preview {
  background-color: var(--color-bg-secondary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.project-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.project-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--color-bg-secondary);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.project-card:hover .project-image img {
  transform: scale(1.1);
}

.project-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: var(--color-text-light);
}

.project-content {
  padding: var(--spacing-lg);
}

.project-content h3 {
  margin-bottom: var(--spacing-sm);
}

.project-content p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

/* Contact Section */
.contact {
  background-color: var(--color-bg-primary);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-2xl);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.info-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.info-item h4 {
  margin-bottom: var(--spacing-xs);
}

.info-item p {
  color: var(--color-text-secondary);
  margin-bottom: 0;
}

.contact-form-wrapper {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
