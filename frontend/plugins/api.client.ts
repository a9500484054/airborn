// plugins/api.client.ts
import { ApiClient } from '~/composables/useApi';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const apiClient = new ApiClient(config.public.apiUrl);
  
  return {
    provide: {
      api: apiClient
    }
  };
});