<template>
  <NuxtLayout name="authenticated">
    <div class="chat-page">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
          </div>
          <div class="header-info">
            <h1 class="page-title">Командный чат</h1>
            <div class="chat-status">
              <div class="status-indicator" :class="{ online: chatStore.isConnected }">
                <span class="status-dot"></span>
                <span class="status-text">{{ chatStore.isConnected ? 'Онлайн' : 'Офлайн' }}</span>
              </div>
              <div v-if="typingUsers.length" class="typing-indicator">
                <span class="typing-dots">
                  <span></span><span></span><span></span>
                </span>
                <span>{{ typingUsers.join(', ') }} печатает...</span>
              </div>
            </div>
          </div>
        </div>
        <div class="header-right">
          <!-- <button class="info-btn" @click="showInfo = !showInfo" :class="{ active: showInfo }">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
              <path d="M10 8V14M10 6H10.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            <span>Инфо</span>
          </button> -->
        </div>
      </div>

      <!-- Chat Info Sidebar -->
      <transition name="slide">
        <div v-if="showInfo" class="chat-info-sidebar">
          <div class="info-header">
            <h3>Информация о чате</h3>
            <button class="close-info" @click="showInfo = false">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="info-content">
            <div class="info-stats">
              <div class="info-stat">
                <div class="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M10 6V10L13 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="stat-details">
                  <span class="stat-label">Участников онлайн</span>
                  <span class="stat-value">{{ onlineUsers }}</span>
                </div>
              </div>
              <div class="info-stat">
                <div class="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5H17M3 10H17M3 15H12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="stat-details">
                  <span class="stat-label">Всего сообщений</span>
                  <span class="stat-value">{{ chatStore.messages.length }}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h4>Участники</h4>
              <div class="participants-list">
                <div v-for="user in participants" :key="user.id" class="participant-item">
                  <div class="participant-avatar" :class="{ 'avatar-online': user.online }">
                    {{ getUserInitials(user.name) }}
                    <span v-if="user.online" class="online-badge"></span>
                  </div>
                  <div class="participant-info">
                    <span class="participant-name">{{ user.name }}</span>
                    <span class="participant-role">Участник</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Messages Container -->
      <div class="messages-container" ref="messagesContainer" :class="{ 'with-sidebar': showInfo }">
        <!-- Loading More Messages -->
        <div v-if="chatStore.isLoading && chatStore.page > 1" class="loading-more">
          <div class="spinner-small"></div>
          <span>Загрузка истории...</span>
        </div>

        <!-- Messages List -->
        <div class="messages-list">
          <!-- Date Separator -->
          <div v-for="(group, date) in groupedMessages" :key="date" class="message-group">
            <div class="date-separator">
              <span class="date-text">{{ formatDateSeparator(date) }}</span>
            </div>

            <div
              v-for="message in group"
              :key="message.id"
              class="message"
              :class="{
                'own-message': message.user.id === authStore.user?.id,
                'has-reply': message.replyTo
              }"
            >
              <!-- Avatar (only for non-own messages) -->
              <div v-if="message.user.id !== authStore.user?.id" class="message-avatar">
                {{ getUserInitials(message.user.name) }}
              </div>

              <div class="message-content">
                <!-- Message Actions (three dots menu) -->
                <div class="message-actions-wrapper" :class="{ 'own-message': message.user.id === authStore.user?.id }">
                  <button class="message-menu-btn" @click.stop="toggleMessageMenu(message.id)" :class="{ 'menu-open': openMenuId === message.id }">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
                      <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                      <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <div v-if="openMenuId === message.id" class="message-menu">
                    <button class="menu-item" @click="setReply(message); openMenuId = null">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L7 4M3 8L7 12M3 8H13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                      </svg>
                      <span>Ответить</span>
                    </button>
                    <button
                      v-if="message.user.id === authStore.user?.id || authStore.user?.role === 'admin'"
                      class="menu-item delete-item"
                      @click="confirmDelete(message.id)"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H14M6 4V2.66667C6 2.31304 6.14048 1.97391 6.39052 1.72386C6.64057 1.47381 6.97971 1.33333 7.33333 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60948 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V4M12.6667 4V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.6869 14 11.3333 14H4.66667C4.31304 14 3.97391 13.8595 3.72386 13.6095C3.47381 13.3594 3.33333 13.0203 3.33333 12.6667V4H12.6667Z" stroke="currentColor" stroke-width="1.2"/>
                      </svg>
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>

                <!-- Message Header -->
                <div class="message-header">
                  <span class="message-author">{{ message.user.name }}</span>
                  <span class="message-time">{{ formatTime(message.createdAt) }}</span>
                </div>

                <!-- Reply Preview -->
                <div v-if="message.replyTo" class="message-reply">
                  <!-- <div class="reply-icon">↩️</div> -->
                  <div class="reply-content">
                    <span class="reply-author">{{ message.replyTo.user?.name || 'Unknown' }}</span>
                    <span class="reply-text">{{ message.replyTo.content || 'Вложение' }}</span>
                  </div>
                </div>

                <!-- Message Content -->
                <div v-if="message.content" class="message-text">
                  {{ message.content }}
                </div>

                <!-- File Attachment -->
                <div v-if="message.fileUrl" class="message-file">
                  <!-- Image preview (no download link) -->
                  <img
                    v-if="message.fileType?.includes('image')"
                    :src="message.fileUrl"
                    alt="Attachment"
                    class="file-image"
                    @click="openImagePreview(message.fileUrl)"
                  />
                  <!-- Download link for non-image files -->
                  <a
                    v-else
                    :href="message.fileUrl"
                    target="_blank"
                    class="file-link"
                  >
                    <div class="file-icon" :class="getFileIconClass(message.fileType)">
                      {{ getFileIcon(message.fileType) }}
                    </div>
                    <div class="file-info">
                      <span class="file-name">{{ getFileType(message.fileType) }}</span>
                      <span class="file-size">Скачать</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2V10M8 10L10 8M8 10L6 8M3 13H13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!chatStore.hasMessages && !chatStore.isLoading" class="empty-chat">
          <div class="empty-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M20 30H60M20 40H50M20 50H40" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <rect x="15" y="15" width="50" height="50" rx="5" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h3>Нет сообщений</h3>
          <p>Напишите первое сообщение в чате!</p>
        </div>
      </div>

      <!-- Message Input -->
      <div class="message-input-container">
        <!-- Reply Preview -->
        <transition name="slide-up">
          <div v-if="replyTo" class="reply-preview-bar">
            <div class="reply-info">
              <div class="reply-badge">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L6 3M2 7L6 11M2 7H12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="reply-details">
                <span class="reply-label">Ответ для {{ replyTo.user.name }}</span>
                <span class="reply-text">{{ replyTo.content || 'Вложение' }}</span>
              </div>
            </div>
            <button class="cancel-reply" @click="replyTo = null">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </transition>

        <form @submit.prevent="sendMessage" class="message-input-form">
          <div class="input-wrapper">
            <textarea
              v-model="newMessage"
              class="message-input"
              placeholder="Введите сообщение..."
              @focus="startTyping"
              @blur="stopTyping"
              @input="handleInput"
              @keydown.enter.exact.prevent="sendMessage"
              rows="1"
            ></textarea>

            <label class="file-upload-btn" title="Прикрепить файл">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                style="display: none"
              />
            </label>

            <button
              type="submit"
              class="send-btn"
              :disabled="!canSend"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 10L17.5 2.5L10 10L17.5 17.5L2.5 10Z" stroke="currentColor" stroke-width="1.2" fill="none"/>
                <path d="M10 10L17.5 2.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </button>
          </div>
        </form>

        <!-- File Preview -->
        <transition name="slide-up">
          <div v-if="selectedFile" class="file-preview">
            <div class="file-preview-info">
              <div class="file-icon-small" :class="getFileIconClass(selectedFile.type)">
                {{ getFileIcon(selectedFile.type) }}
              </div>
              <div class="file-details">
                <span class="file-name">{{ selectedFile.name }}</span>
                <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
              </div>
            </div>
            <button class="remove-file" @click="removeFile">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </button>
          </div>
        </transition>
      </div>

      <!-- Image Preview Modal -->
      <transition name="modal">
        <div v-if="previewImage" class="image-preview-modal" @click="previewImage = null">
          <div class="modal-content" @click.stop>
            <img :src="previewImage" alt="Preview" />
            <button class="close-modal" @click="previewImage = null">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M1 1L19 19M19 1L1 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </transition>

      <!-- Delete Confirmation Modal -->
      <transition name="modal">
        <div v-if="showDeleteModal" class="delete-modal-overlay" @click="cancelDelete">
          <div class="delete-modal" @click.stop>
            <div class="delete-modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2"/>
                <path d="M16 16L32 32M32 16L16 32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="delete-modal-title">Удалить сообщение?</h3>
            <p class="delete-modal-text">Это действие нельзя отменить. Сообщение будет удалено навсегда.</p>
            <div class="delete-modal-actions">
              <button class="btn-cancel" @click="cancelDelete">Отмена</button>
              <button class="btn-delete" @click="executeDelete">Удалить</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { watch } from 'vue';

definePageMeta({
  middleware: ['auth'],
});

const authStore = useAuthStore();
const chatStore = useChatStore();
const messagesContainer = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const showInfo = ref(false);
const previewImage = ref<string | null>(null);
const openMenuId = ref<string | null>(null);

// Delete confirmation state
const showDeleteModal = ref(false);
const messageToDelete = ref<string | null>(null);

const newMessage = ref('');
const replyTo = ref<any>(null);
const selectedFile = ref<File | null>(null);
const typingTimeout = ref<NodeJS.Timeout | null>(null);

// Mock data for participants and online users
const onlineUsers = ref(5);
const participants = ref([
  { id: '1', name: 'Иван Петров', online: true },
  { id: '2', name: 'Елена Смирнова', online: true },
  { id: '3', name: 'Алексей Иванов', online: false },
  { id: '4', name: 'Мария Кузнецова', online: true },
]);

const typingUsers = computed(() => {
  return Array.from(chatStore.typingUsers.entries())
    .filter(([userId, data]) => userId !== authStore.user?.id)
    .map(([userId, data]) => data.name.split(' ')[0]);
});

const canSend = computed(() => {
  return (newMessage.value.trim() || selectedFile.value) && chatStore.isConnected;
});

// Group messages by date
const groupedMessages = computed(() => {
  const groups: Record<string, any[]> = {};
  chatStore.messages.forEach(message => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  return groups;
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initFromStorage();
  }

  if (authStore.accessToken) {
    chatStore.connect(authStore.accessToken);
  }

  // Disable body scroll on chat page
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    scrollToBottom();
  }, 500);
});

watch(() => chatStore.messages.length, () => {
  scrollToBottom();
}, { immediate: false });

onBeforeUnmount(() => {
  chatStore.disconnect();
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }
  // Restore body scroll when leaving chat page
  document.body.style.overflow = '';
});

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }, 100);
};

const handleInput = () => {
  chatStore.startTyping();

  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  typingTimeout.value = setTimeout(() => {
    chatStore.stopTyping();
  }, 1000);
};

const sendMessage = async () => {
  if (!canSend.value) return;

  let fileUrl = '';
  let fileType = '';

  if (selectedFile.value) {
    const config = useRuntimeConfig();
    const formData = new FormData();
    formData.append('files', selectedFile.value);

    try {
      const { data } = await useFetch(`${config.public.apiUrl}/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: formData,
      });

      if (data.value) {
        const response = data.value as any;
        const uploadedFile = response.data.files[0];
        fileUrl = uploadedFile.url;
        fileType = uploadedFile.mimeType;
      }
    } catch (error) {
      console.error('File upload failed:', error);
    }
  }

  const success = chatStore.sendMessage(
    newMessage.value.trim() || undefined,
    fileUrl || undefined,
    fileType || undefined,
    replyTo.value?.id
  );

  if (success) {
    newMessage.value = '';
    replyTo.value = null;
    selectedFile.value = null;
    scrollToBottom();
  }
};

const setReply = (message: any) => {
  replyTo.value = message;
};

// Custom delete confirmation
const confirmDelete = (messageId: string) => {
  messageToDelete.value = messageId;
  showDeleteModal.value = true;
  openMenuId.value = null; // Close menu
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  messageToDelete.value = null;
};

const executeDelete = async () => {
  if (messageToDelete.value) {
    await chatStore.deleteMessage(messageToDelete.value);
    cancelDelete();
  }
};

const toggleMessageMenu = (messageId: string) => {
  openMenuId.value = openMenuId.value === messageId ? null : messageId;
};

const startTyping = () => {
  chatStore.startTyping();
};

const stopTyping = () => {
  chatStore.stopTyping();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    if (file.size > 20 * 1024 * 1024) {
      alert('Размер файла не должен превышать 20MB');
      return;
    }

    selectedFile.value = file;
  }
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const openImagePreview = (url: string) => {
  previewImage.value = url;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateSeparator = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};

const getFullUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl.replace('/api', '');
  return `${apiUrl}${path}`;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return '📎';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel')) return '📊';
  return '📎';
};

const getFileIconClass = (mimeType?: string) => {
  if (!mimeType) return '';
  if (mimeType.includes('pdf')) return 'file-pdf';
  if (mimeType.includes('image')) return 'file-image';
  if (mimeType.includes('word')) return 'file-word';
  if (mimeType.includes('excel')) return 'file-excel';
  return '';
};

const getFileType = (mimeType?: string) => {
  if (!mimeType) return 'Файл';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('image')) return 'Изображение';
  if (mimeType.includes('word')) return 'Документ';
  if (mimeType.includes('excel')) return 'Таблица';
  return 'Файл';
};

const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

useHead({
  title: 'Чат - AirBorn',
});
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* ===== CHAT HEADER ===== */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  background: white;
  border-bottom: 1px solid #f0f2f5;
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0;
  letter-spacing: -0.01em;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
  transition: all 0.2s ease;
}

.status-indicator.online .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

.status-text {
  color: #6b7280;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #3b82f6;
  background: #eff6ff;
  padding: 4px 10px;
  border-radius: 20px;
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #3b82f6;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.header-right .info-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;
}

.header-right .info-btn:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
  color: #3b82f6;
}

.header-right .info-btn.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Chat Info Sidebar */
.chat-info-sidebar {
  position: absolute;
  top: 73px;
  right: 24px;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.02);
  z-index: 10;
  overflow: hidden;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.info-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0;
}

.close-info {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.close-info:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.info-content {
  padding: 20px;
}

.info-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.info-stat {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.stat-details {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
}

.info-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.participant-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  position: relative;
  flex-shrink: 0;
}

.participant-avatar.avatar-online .online-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid white;
}

.participant-info {
  flex: 1;
}

.participant-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1a1f36;
}

.participant-role {
  font-size: 11px;
  color: #9ca3af;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #fafbfc;
  transition: all 0.3s ease;
}

.messages-container.with-sidebar {
  padding-right: 360px;
}

/* Custom Scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: #6b7280;
  font-size: 13px;
}

.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Message Group */
.message-group {
  margin-bottom: 20px;
}

.date-separator {
  text-align: center;
  margin: 24px 0;
}

.date-text {
  display: inline-block;
  padding: 4px 12px;
  background: #e5e7eb;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
}

/* Message */
.message {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.message.own-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-content {
  max-width: 60%;
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.message.own-message .message-content {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.message-author {
  font-weight: 600;
  font-size: 11px;
  color: #374151;
}

.message.own-message .message-author {
  color: rgba(255, 255, 255, 0.9);
}

.message-time {
  font-size: 9px;
  color: #9ca3af;
}

.message.own-message .message-time {
  color: rgba(255, 255, 255, 0.6);
}

/* Reply Preview */
.message-reply {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  background: #f8f9fa;
  border-radius: 16px;
  margin-bottom: 10px;
  border-left: 4px solid #3b82f6;
  transition: all 0.2s ease;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
}

/* Улучшенная адаптация для своих сообщений (тёмная тема) */
.message.own-message .message-reply {
  background: rgba(255, 255, 255, 0.08);
  border-left-color: #60a5fa;
  backdrop-filter: blur(2px);
}

.reply-icon {
  font-size: 14px;
  opacity: 0.7;
  flex-shrink: 0;
  margin-top: 2px;
}

.reply-content {
  flex: 1;
  min-width: 0; /* для корректного обрезания текста */
}

.reply-author {
  font-weight: 600;
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
  color: #1f2937;
  letter-spacing: -0.2px;
}

.message.own-message .reply-author {
  color: #e5e7eb;
}

.reply-text {
  font-size: 12px;
  line-height: 1.4;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.message.own-message .reply-text {
  color: #ffffff;
}


/* Message Text */
.message-text {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* File Attachment */
.message-file {
  margin-top: 10px;
  max-width: 260px;
}

.file-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f1f5f9;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  border: 1px solid rgba(0, 0, 0, 0.03);
  width: 100%;
  box-sizing: border-box;
}

.message.own-message .file-link {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.08);
}

.file-link:hover {
  background: #e9eef3;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.message.own-message .file-link:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

/* Иконка файла */
.file-icon {
  font-size: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  transition: all 0.2s;
}

.message.own-message .file-icon {
  background: rgba(255, 255, 255, 0.08);
}

.file-link:hover .file-icon {
  transform: scale(1.02);
}

.file-icon.file-pdf {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}
.file-icon.file-image {
  color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
}
.file-icon.file-word {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}
.file-icon.file-excel {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

/* Информация о файле */
.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: #1f2937;
  word-break: break-word;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message.own-message .file-name {
  color: #f1f5f9;
}

.file-size {
  display: block;
  font-size: 10px;
  font-weight: 500;
  opacity: 0.55;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin-top: 2px;
}

/* Стрелка скачивания */
.file-link svg {
  flex-shrink: 0;
  opacity: 0.5;
  transition: all 0.2s;
}

.file-link:hover svg {
  opacity: 1;
  transform: translateY(2px);
}

.message.own-message .file-link svg {
  stroke: #e2e8f0;
  opacity: 0.6;
}

/* Изображения (превью) */
.file-image {
  max-width: 260px;
  max-height: 180px;
  width: 100%;
  object-fit: cover;
  border-radius: 16px;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.file-image:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* Message Actions (three dots menu) */
.message {
  position: relative;
}

.message-content {
  position: relative;
}

.message-actions-wrapper {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.message:hover .message-actions-wrapper {
  opacity: 1;
  visibility: visible;
}

.message-menu-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.message.own-message .message-menu-btn {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

.message-menu-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #3b82f6;
}

.message.own-message .message-menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.message-menu-btn.menu-open {
  opacity: 1;
  visibility: visible;
}


.message-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
  padding: 6px;
  min-width: 160px;
  z-index: 10;
}

.message.own-message .message-menu {
 left: -131px;
}


.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item.delete-item {
  color: #ef4444;
}

.menu-item.delete-item:hover {
  background: #fef2f2;
}

/* Empty Chat */
.empty-chat {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-chat h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.empty-chat p {
  color: #9ca3af;
  font-size: 14px;
}

/* Message Input */
.message-input-container {
  padding: 16px 24px 20px;
  background: white;
  border-top: 1px solid #f0f2f5;
}

.reply-preview-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 12px;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 3px solid #3b82f6;
}

.reply-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.reply-badge {
  width: 24px;
  height: 24px;
  background: #eff6ff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.reply-details {
  flex: 1;
}

.reply-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #3b82f6;
  margin-bottom: 2px;
}

.reply-text {
  font-size: 11px;
  color: #6b7280;
}

.cancel-reply {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.cancel-reply:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.message-input-form {
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.message-input {
  flex: 1;
  padding: 12px 18px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  max-height: 100px;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.message-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

.file-upload-btn {
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.file-upload-btn:hover {
  background: #e5e7eb;
  border-color: #3b82f6;
  color: #3b82f6;
}

.send-btn {
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  transform: rotate(180deg);
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* File Preview */
.file-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  margin-top: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.file-preview-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon-small {
  font-size: 24px;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 12px;
  font-weight: 500;
  color: #1a1f36;
}

.file-size {
  font-size: 10px;
  color: #9ca3af;
}

.remove-file {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.remove-file:hover {
  background: #f3f4f6;
  color: #ef4444;
}

/* Image Preview Modal */
.image-preview-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.close-modal {
  position: absolute;
  top: -48px;
  right: -48px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #1f2937;
}

.close-modal:hover {
  transform: scale(1.1);
  background: #ef4444;
  color: white;
}

/* Delete Confirmation Modal */
.delete-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(4px);
}

.delete-modal {
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.delete-modal-icon {
  color: #ef4444;
  margin-bottom: 20px;
  opacity: 0.9;
}

.delete-modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.delete-modal-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.delete-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  padding: 10px 24px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-delete {
  padding: 10px 24px;
  border-radius: 12px;
  background: #ef4444;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .messages-container.with-sidebar {
    padding-right: 24px;
  }
  
  .chat-info-sidebar {
    right: 16px;
    width: 300px;
  }
  
  .message-content {
    max-width: 75%;
  }
}

@media (max-width: 768px) {
  .chat-header {
    padding: 12px 16px;
  }
  
  .chat-icon {
    width: 36px;
    height: 36px;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .messages-container {
    padding: 16px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .chat-info-sidebar {
    width: 100%;
    right: 0;
    top: auto;
    bottom: 0;
    border-radius: 20px 20px 0 0;
  }
  
  .messages-container.with-sidebar {
    padding-right: 16px;
  }
  
  .message-input-container {
    padding: 12px 16px 16px;
  }
  
  .delete-modal {
    padding: 24px;
    margin: 0 16px;
  }
  
  .delete-modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .message-content {
    max-width: 90%;
  }
  
  .file-image {
    max-width: 200px;
  }
  
  .input-wrapper {
    gap: 8px;
  }
  
  .message-input {
    padding: 10px 14px;
  }
  
  .file-upload-btn,
  .send-btn {
    width: 38px;
    height: 38px;
  }
  
  .close-modal {
    top: -40px;
    right: 0;
  }
}
</style>