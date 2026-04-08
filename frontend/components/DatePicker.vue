<template>
  <div class="custom-date-picker" ref="pickerRef">
    <div class="date-trigger" :class="{ 'has-error': error, 'is-open': isOpen }" @click="togglePicker">
      <input
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        readonly
        :disabled="disabled"
      />
      <svg
        class="calendar-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Calendar Popup -->
    <Teleport to="body" :disabled="!teleportContainer">
      <transition name="calendar-fade">
        <div v-if="isOpen" class="calendar-popup" :style="popupStyle">
          <div class="calendar-header">
            <button type="button" class="nav-btn" @click="prevMonth">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <span class="month-year">{{ monthYearText }}</span>
            <button type="button" class="nav-btn" @click="nextMonth">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="calendar-weekdays">
            <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
          </div>

          <div class="calendar-days">
            <button
              v-for="day in calendarDays"
              :key="day.date"
              type="button"
              class="day-btn"
              :class="{
                'other-month': !day.currentMonth,
                'selected': day.selected,
                'today': day.isToday,
                'disabled': day.disabled
              }"
              :disabled="day.disabled"
              @click="selectDate(day)"
            >
              {{ day.day }}
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: 'ДД.ММ.ГГГГ'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  minDate: {
    type: Date,
    default: null
  },
  maxDate: {
    type: Date,
    default: null
  },
  error: {
    type: String,
    default: ''
  },
  teleportContainer: {
    type: [String, Boolean],
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const pickerRef = ref(null)
const popupStyle = ref({})

// Current viewing month/year
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

// Russian month names
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

// Week days starting from Monday
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const monthYearText = computed(() => {
  return `${monthNames[viewMonth.value]} ${viewYear.value}`
})

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  
  try {
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) return ''
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}.${month}.${year}`
  } catch (e) {
    return ''
  }
})

// Generate calendar days
const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const lastDay = new Date(viewYear.value, viewMonth.value + 1, 0)
  
  // Get day of week (0 = Sunday, convert to Monday-based)
  let startDayOfWeek = firstDay.getDay() - 1
  if (startDayOfWeek < 0) startDayOfWeek = 6
  
  // Previous month days
  const prevMonthLastDay = new Date(viewYear.value, viewMonth.value, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(viewYear.value, viewMonth.value - 1, day)
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      currentMonth: false,
      selected: false,
      isToday: isToday(date),
      disabled: isDisabled(date)
    })
  }
  
  // Current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(viewYear.value, viewMonth.value, day)
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      currentMonth: true,
      selected: isSelected(date),
      isToday: isToday(date),
      disabled: isDisabled(date)
    })
  }
  
  // Next month days to fill grid
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(viewYear.value, viewMonth.value + 1, day)
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      currentMonth: false,
      selected: false,
      isToday: isToday(date),
      disabled: isDisabled(date)
    })
  }
  
  return days
})

function isToday(date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isSelected(date) {
  if (!props.modelValue) return false
  return date.toISOString().split('T')[0] === props.modelValue
}

function isDisabled(date) {
  if (props.minDate && date < new Date(props.minDate.getFullYear(), props.minDate.getMonth(), props.minDate.getDate())) {
    return true
  }
  if (props.maxDate && date > new Date(props.maxDate.getFullYear(), props.maxDate.getMonth(), props.maxDate.getDate())) {
    return true
  }
  return false
}

function prevMonth() {
  viewMonth.value--
  if (viewMonth.value < 0) {
    viewMonth.value = 11
    viewYear.value--
  }
}

function nextMonth() {
  viewMonth.value++
  if (viewMonth.value > 11) {
    viewMonth.value = 0
    viewYear.value++
  }
}

function selectDate(day) {
  if (day.disabled) return
  emit('update:modelValue', day.date)
  emit('change')
  isOpen.value = false
}

function togglePicker() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  
  if (isOpen.value) {
    nextTick(() => {
      updatePosition()
    })
  }
}

function updatePosition() {
  if (!pickerRef.value) return
  
  const rect = pickerRef.value.getBoundingClientRect()
  popupStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.bottom + 8}px`,
    zIndex: 9999
  }
}

function handleClickOutside(event) {
  if (!pickerRef.value || !isOpen.value) return
  
  const clickedInside = pickerRef.value.contains(event.target)
  const calendar = document.querySelector('.calendar-popup')
  const clickedCalendar = calendar && calendar.contains(event.target)
  
  if (!clickedInside && !clickedCalendar) {
    isOpen.value = false
  }
}

// Initialize view to selected date if provided
if (props.modelValue) {
  const selectedDate = new Date(props.modelValue)
  if (!isNaN(selectedDate.getTime())) {
    viewYear.value = selectedDate.getFullYear()
    viewMonth.value = selectedDate.getMonth()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
})
</script>

<style scoped>
.custom-date-picker {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-trigger {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  overflow: hidden;
  cursor: pointer;
}

.date-trigger:hover {
  border-color: #9ca3af;
}

.date-trigger.is-open {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.date-trigger.has-error {
  border-color: #ef4444;
}

.date-trigger.has-error:hover {
  border-color: #dc2626;
}

.date-trigger input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}

.date-trigger input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.date-trigger input::placeholder {
  color: #9ca3af;
}

.calendar-icon {
  position: relative;
  right: 12px;
  color: #6b7280;
  pointer-events: none;
  flex-shrink: 0;
}

.error-message {
  font-size: 12px;
  color: #ef4444;
  margin-top: 2px;
}

/* Calendar Popup */
.calendar-popup {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  width: 280px;
  user-select: none;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.month-year {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  padding: 4px 0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-btn {
  width: 100%;
  aspect-ratio: 1;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 13px;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.day-btn:hover:not(.disabled) {
  background: #f3f4f6;
}

.day-btn.other-month {
  color: #d1d5db;
}

.day-btn.today {
  font-weight: 700;
  color: #3b82f6;
}

.day-btn.selected {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-weight: 600;
}

.day-btn.selected:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.day-btn.disabled {
  color: #e5e7eb;
  cursor: not-allowed;
  opacity: 0.5;
}

/* Calendar fade transition */
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition: opacity 0.2s ease;
}

.calendar-fade-enter-from,
.calendar-fade-leave-to {
  opacity: 0;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .date-trigger input {
    padding: 12px;
    font-size: 16px;
  }
  
  .calendar-icon {
    right: 10px;
    width: 22px;
    height: 22px;
  }
  
  .calendar-popup {
    width: calc(100vw - 32px);
    max-width: 320px;
    left: 16px !important;
  }
}

@media (max-width: 480px) {
  .date-trigger {
    border-radius: 6px;
  }
  
  .date-trigger input {
    padding: 14px 10px;
    font-size: 16px;
  }
  
  .calendar-icon {
    right: 8px;
    width: 24px;
    height: 24px;
  }
  
  .day-btn {
    font-size: 14px;
  }
}
</style>
