/**
 * Chat Store
 * Manages WebSocket chat state and actions
 */
import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  content: string | null;
  fileUrl?: string | null;
  fileType?: string | null;
  replyToId?: string | null;
  replyTo?: ChatMessage | null;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  createdAt: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  typingUsers: Map<string, { name: string; timeout: NodeJS.Timeout }>;
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    isConnected: false,
    isTyping: false,
    typingUsers: new Map(),
    isLoading: false,
    error: null,
    page: 1,
    hasMore: true,
  }),

  getters: {
    messageCount(): number {
      return this.messages.length;
    },

    hasMessages(): boolean {
      return this.messages.length > 0;
    },
  },

  actions: {
    /**
     * Initialize WebSocket connection
     */
    connect(token: string) {
      // Disconnect existing connection first
      if (this.socket) {
        this.disconnect();
      }

      const config = useRuntimeConfig();
      const wsUrl = config.public.wsUrl;

      console.log('Connecting to WebSocket:', wsUrl);

      this.socket = io(wsUrl, {
        query: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: { token },
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.error = null;
        console.log('WebSocket connected');
        // Load messages after connection
        this.loadMessages(1);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('WebSocket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        this.error = error.message;
        this.isConnected = false;
        console.error('WebSocket connection error:', error);
      });

      this.socket.on('new_message', (message: ChatMessage) => {
        // Avoid duplicates
        const exists = this.messages.some(m => m.id === message.id);
        if (!exists) {
          // If message has replyToId but not replyTo object, find it in existing messages
          if (message.replyToId && !message.replyTo) {
            const repliedMessage = this.messages.find(m => m.id === message.replyToId);
            if (repliedMessage) {
              message.replyTo = repliedMessage;
            }
          }
          // Add to end (newest at bottom)
          this.messages.push(message);
        }
      });

      this.socket.on('user_typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
        if (data.isTyping) {
          this.typingUsers.set(data.userId, {
            name: data.userName,
            timeout: setTimeout(() => {
              this.typingUsers.delete(data.userId);
            }, 3000),
          });
        } else {
          const typingUser = this.typingUsers.get(data.userId);
          if (typingUser) {
            clearTimeout(typingUser.timeout);
            this.typingUsers.delete(data.userId);
          }
        }
      });

      this.socket.on('messages_read', (data: { userId: string; readAt: string }) => {
        console.log('Messages read by:', data.userId);
      });

      this.socket.on('user_online', (data: { userId: string }) => {
        console.log('User online:', data.userId);
      });

      this.socket.on('user_offline', (data: { userId: string }) => {
        console.log('User offline:', data.userId);
      });

      this.socket.on('error', (data: { message: string }) => {
        this.error = data.message;
        console.error('WebSocket error:', data.message);
      });
    },

    /**
     * Disconnect WebSocket
     */
    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
      }
    },

    /**
     * Send message
     */
    sendMessage(content?: string, fileUrl?: string, fileType?: string, replyToId?: string) {
      if (!this.socket || !this.isConnected) {
        console.error('WebSocket not connected');
        return false;
      }

      if (!content && !fileUrl) {
        console.error('Message must have content or file');
        return false;
      }

      this.socket.emit('send_message', {
        content,
        fileUrl,
        fileType,
        replyToId,
      });

      this.isTyping = false;
      return true;
    },

    /**
     * Start typing indicator
     */
    startTyping() {
      if (!this.isTyping && this.socket && this.isConnected) {
        this.socket.emit('typing_start');
        this.isTyping = true;
      }
    },

    /**
     * Stop typing indicator
     */
    stopTyping() {
      if (this.isTyping && this.socket && this.isConnected) {
        this.socket.emit('typing_stop');
        this.isTyping = false;
      }
    },

    /**
     * Mark messages as read
     */
    markAsRead() {
      if (this.socket && this.isConnected) {
        this.socket.emit('mark_read');
      }
    },

    /**
     * Load message history
     */
    async loadMessages(page: number = 1, limit: number = 50) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();

        if (!authStore.accessToken) {
          console.warn('No access token, skipping message load');
          this.isLoading = false;
          return;
        }

        const { data } = await useFetch(`${config.public.apiUrl}/messages?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        if (data.value) {
          const response = data.value as any;
          const newMessages = response.data.data || [];

          if (page === 1) {
            // Replace all messages for first page
            this.messages = newMessages;
          } else {
            // Prepend older messages (oldest at top), avoiding duplicates
            const existingIds = new Set(this.messages.map(m => m.id));
            const olderMessages = newMessages.filter(m => !existingIds.has(m.id));
            this.messages = [...olderMessages, ...this.messages];
          }

          this.page = page;

          // Update hasMore based on server response AND client-side check
          const serverHasMore = page < response.data.meta.totalPages;
          const clientHasMore = newMessages.length >= limit;
          this.hasMore = serverHasMore && clientHasMore;
        }
      } catch (error: any) {
        console.error('Failed to load messages:', error);
        this.error = error.data?.error?.message || 'Failed to load messages';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Load more messages (for infinite scroll)
     */
    async loadMore() {
      if (!this.hasMore || this.isLoading) return;
      await this.loadMessages(this.page + 1);
    },

    /**
     * Search messages
     */
    async searchMessages(query: string, page: number = 1, limit: number = 20) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const { data } = await useFetch(
          `${config.public.apiUrl}/messages/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
        );

        if (data.value) {
          const response = data.value as any;
          return { success: true, data: response.data };
        }
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Search failed';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }

      return { success: false, error: 'Unknown error' };
    },

    /**
     * Delete message
     */
    async deleteMessage(messageId: string) {
      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        
        await useFetch(`${config.public.apiUrl}/messages/${messageId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        // Remove from local state
        const index = this.messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.data?.error?.message || 'Delete failed' };
      }
    },

    /**
     * Clear chat state
     */
    clear() {
      this.messages = [];
      this.isConnected = false;
      this.isTyping = false;
      this.typingUsers.clear();
      this.isLoading = false;
      this.error = null;
      this.page = 1;
      this.hasMore = true;
    },
  },
});
