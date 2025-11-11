import { ref, computed, type Ref } from 'vue';

export function usePagination<T>(items: Ref<T[]>, itemsPerPage: Ref<number> = ref(10)) {
  const currentPage = ref(1);

  const totalPages = computed(() => {
    if (!items.value) return 1;
    return Math.ceil(items.value.length / itemsPerPage.value);
  });

  const paginatedItems = computed(() => {
    if (!items.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return items.value.slice(start, end);
  });

  return {
    currentPage,
    totalPages,
    paginatedItems,
  };
}