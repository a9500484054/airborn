<template>
  <div v-if="showHint" class="push-hint-wrapper">
    <div class="push-hint">
      <div class="push-hint-icon">📱</div>
      <!-- |{{ showHint }} -->
      
      <div class="push-hint-content">
        <h4>Получайте уведомления на iPhone</h4>
        <p class="push-hint-text">
          Добавьте AirBorn на главный экран, чтобы включить push-уведомления о новых сообщениях
        </p>

        <div class="push-hint-steps">
          <div class="step">
            <span class="step-number">1</span>
            <span>Нажмите <strong>Поделиться</strong> в Safari</span>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <span>Выберите «<strong>На экран «Домой»</strong>»</span>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <span>Откройте приложение и разрешите уведомления</span>
          </div>
        </div>

        <button 
          @click="enablePush"
          :disabled="isEnabling"
          class="btn-enable-push"
        >
          {{ isEnabling ? 'Включаем...' : 'Включить push-уведомления' }}
        </button>
      </div>

      <button class="push-hint-close" @click="dismissHint">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const push = usePushNotifications()
const isEnabling = ref(false)

// Используем localStorage для сохранения состояния
const hintDismissed = ref(localStorage.getItem('push-hint-dismissed') === 'true')

const showHint = computed(() => {
  const value = push.isIOS && 
         push.isSupported && 
         !hintDismissed.value && 
         push.permission !== 'granted' // Скрываем если уже разрешено
         console.log('value', value)
  return value
})

const enablePush = async () => {
  isEnabling.value = true
  
  try {
    // Запоминаем текущее состояние до запроса
    const previousState = push.permission
    
    // Запрашиваем разрешение
    await push.enableNotifications()
    
    // Ждем небольшой таймаут чтобы состояние успело обновиться
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Проверяем новое состояние
    if (push.permission === 'granted') {
      // Разрешение получено - скрываем навсегда
      hintDismissed.value = true
      localStorage.setItem('push-hint-dismissed', 'true')
    } else if (push.permission === 'denied') {
      // Пользователь отклонил - скрываем
      hintDismissed.value = true
      localStorage.setItem('push-hint-dismissed', 'true')
    } else if (push.permission === 'default' || push.permission === previousState) {
      // Пользователь проигнорировал или закрыл диалог - показываем снова
      hintDismissed.value = false
      localStorage.removeItem('push-hint-dismissed')
    }
  } catch (error) {
    console.error('Error enabling notifications:', error)
    // При ошибке показываем подсказку снова через 5 секунд
    setTimeout(() => {
      hintDismissed.value = false
      localStorage.removeItem('push-hint-dismissed')
    }, 5000)
  } finally {
    isEnabling.value = false
  }
}

const dismissHint = () => {
  hintDismissed.value = true
  localStorage.setItem('push-hint-dismissed', 'true')
}
</script>

<style scoped>
.push-hint-wrapper {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 420px;
  margin: 0 auto;
}

.push-hint {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  gap: 16px;
  position: relative;
  border: 1px solid #e5e7eb;
}

.push-hint-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.push-hint-content {
  flex: 1;
}

.push-hint-content h4 {
  margin: 0 0 8px 0;
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
}

.push-hint-text {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.4;
  margin-bottom: 16px;
}

.push-hint-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #374151;
}

.step-number {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.btn-enable-push {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-enable-push:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-enable-push:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.push-hint-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
}

.push-hint-close:hover {
  color: #6b7280;
}

@media (max-width: 480px) {
  .push-hint-wrapper {
    bottom: 16px;
    left: 16px;
    right: 16px;
  }
}
</style>