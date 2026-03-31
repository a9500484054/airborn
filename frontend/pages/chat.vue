<template>
  <NuxtLayout name="authenticated">
    <div class="chat-page">
      <div class="chat-header">
        <h1 class="page-title mb-0">Team Chat</h1>
        <div class="chat-status">
          <span class="status-indicator" :class="{ online: chatStore.isConnected }">
            {{ chatStore.isConnected ? 'Connected' : 'Disconnected' }}
          </span>
          <span v-if="typingUsers.length" class="typing-indicator">
            {{ typingUsers.join(', ') }} typing...
          </span>
        </div>
      </div>

      <!-- Messages Container -->
      <div class="messages-container" ref="messagesContainer">
        <!-- Loading More Messages -->
        <div v-if="chatStore.isLoading && chatStore.page > 1" class="loading-more">
          <div class="spinner spinner-sm"></div>
        </div>

        <!-- Messages List -->
        <div class="messages-list">
          <div
            v-for="message in chatStore.messages"
            :key="message.id"
            class="message"
            :class="{ 'own-message': message.user.id === authStore.user?.id }"
          >
            <div class="message-avatar">
              {{ getUserInitials(message.user.name) }}
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">{{ message.user.name }}</span>
                <span class="message-time">{{ formatTime(message.createdAt) }}</span>
              </div>

              <!-- Reply Preview -->
              <div v-if="message.replyTo" class="message-reply">
                <div class="reply-preview">
                  <span class="reply-author">{{ message.replyTo.user?.name || 'Unknown' }}:</span>
                  <span class="reply-content">{{ message.replyTo.content || 'File attachment' }}</span>
                </div>
              </div>

              <!-- Message Content -->
              <div v-if="message.content" class="message-text">
                {{ message.content }}
              </div>

              <!-- File Attachment -->
              <div v-if="message.fileUrl" class="message-file">
                <a :href="message.fileUrl" target="_blank" class="file-link">
                  <span class="file-icon">{{ getFileIcon(message.fileType) }}</span>
                  <span class="file-name">Download File</span>
                </a>
                <img
                  v-if="message.fileType?.includes('image')"
                  :src="message.fileUrl"
                  alt="Attachment"
                  class="file-image"
                />
              </div>

              <!-- Message Actions -->
              <div class="message-actions">
                <button class="action-btn" @click="setReply(message)" title="Reply">
                  ↩️ Reply
                </button>
                <button
                  v-if="message.user.id === authStore.user?.id"
                  class="action-btn"
                  @click="deleteMessage(message.id)"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!chatStore.hasMessages && !chatStore.isLoading" class="empty-chat">
          <div class="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p class="text-muted">Be the first to send a message!</p>
        </div>
      </div>

      <!-- Message Input -->
      <div class="message-input-container">
        <!-- Reply Preview -->
        <div v-if="replyTo" class="reply-preview-bar">
          <span class="reply-label">Replying to {{ replyTo.user.name }}:</span>
          <span class="reply-text">{{ replyTo.content || 'File attachment' }}</span>
          <button class="cancel-reply" @click="replyTo = null">✕</button>
        </div>

        <form @submit.prevent="sendMessage" class="message-input-form">
          <div class="input-wrapper">
            <input
              v-model="newMessage"
              type="text"
              class="form-input"
              placeholder="Type a message..."
              @focus="startTyping"
              @blur="stopTyping"
              @input="handleInput"
            />
            <label class="file-upload-btn" title="Attach file">
              📎
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
              class="btn btn-primary"
              :disabled="!canSend"
            >
              Send
            </button>
          </div>
        </form>

        <!-- File Preview -->
        <div v-if="selectedFile" class="file-preview">
          <div class="file-preview-info">
            <span class="file-icon">{{ getFileIcon(selectedFile.type) }}</span>
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button class="remove-file" @click="removeFile">✕</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const authStore = useAuthStore();
const chatStore = useChatStore();
const messagesContainer = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const newMessage = ref('');
const replyTo = ref<any>(null);
const selectedFile = ref<File | null>(null);
const typingTimeout = ref<NodeJS.Timeout | null>(null);

const typingUsers = computed(() => {
  return Array.from(chatStore.typingUsers.values())
    .filter(u => u.name !== authStore.user?.name)
    .map(u => u.name.split(' ')[0]);
});

const canSend = computed(() => {
  return (newMessage.value.trim() || selectedFile.value) && chatStore.isConnected;
});

onMounted(async () => {
  // Initialize auth if needed
  if (!authStore.isAuthenticated) {
    authStore.initFromStorage();
  }

  // Load message history
  await chatStore.loadMessages(1);

  // Connect to WebSocket
  if (authStore.accessToken) {
    chatStore.connect(authStore.accessToken);
  }

  // Scroll to bottom
  scrollToBottom();
});

onBeforeUnmount(() => {
  chatStore.disconnect();
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }
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

  // Upload file if selected
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

  // Send message
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

const deleteMessage = async (messageId: string) => {
  if (!confirm('Delete this message?')) return;
  await chatStore.deleteMessage(messageId);
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
    
    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('File size must be less than 20MB');
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

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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

const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

useHead({
  title: 'Chat - AirBorn',
});
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  max-width: 1200px;
  margin: 0 auto;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
}

.chat-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.status-indicator {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.status-indicator.online {
  color: var(--color-success);
}

.status-indicator.online::before {
  content: '●';
  margin-right: var(--spacing-xs);
}

.typing-indicator {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-style: italic;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  scroll-behavior: smooth;
}

.loading-more {
  text-align: center;
  padding: var(--spacing-md);
}

.spinner-sm {
  width: 24px;
  height: 24px;
  margin: 0 auto;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.message {
  display: flex;
  gap: var(--spacing-md);
  max-width: 80%;
}

.message.own-message {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}

.message.own-message .message-content {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.message-author {
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.message-time {
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

.message-reply {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-primary);
}

.message.own-message .message-reply {
  background-color: rgba(255, 255, 255, 0.1);
}

.reply-preview {
  font-size: var(--font-size-sm);
}

.reply-author {
  font-weight: 600;
  margin-right: var(--spacing-xs);
}

.reply-content {
  opacity: 0.8;
}

.message-text {
  margin-bottom: var(--spacing-sm);
  word-wrap: break-word;
}

.message-file {
  margin-top: var(--spacing-sm);
}

.file-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  font-size: var(--font-size-sm);
}

.message.own-message .file-link {
  background-color: rgba(255, 255, 255, 0.1);
}

.file-image {
  max-width: 300px;
  max-height: 200px;
  border-radius: var(--radius-md);
  margin-top: var(--spacing-sm);
}

.message-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-xs);
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.action-btn:hover {
  opacity: 1;
}

.empty-chat {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.message-input-container {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-primary);
}

.reply-preview-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
  font-size: var(--font-size-sm);
}

.reply-label {
  font-weight: 600;
}

.reply-text {
  flex: 1;
  opacity: 0.8;
}

.cancel-reply {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  opacity: 0.7;
}

.cancel-reply:hover {
  opacity: 1;
}

.message-input-form {
  width: 100%;
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
}

.input-wrapper input {
  flex: 1;
}

.file-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  cursor: pointer;
  font-size: var(--font-size-lg);
  transition: background-color var(--transition-fast);
}

.file-upload-btn:hover {
  background-color: var(--color-primary);
}

.file-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-top: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.file-preview-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.remove-file {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  opacity: 0.7;
}

.remove-file:hover {
  opacity: 1;
}
</style>
