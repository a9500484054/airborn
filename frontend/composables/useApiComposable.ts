// composables/useApiComposable.ts
export const useApi = () => {
  const { $api } = useNuxtApp();
  return $api;
};