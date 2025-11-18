import { ref, computed, type Ref } from 'vue';

export function usePagination<T>(
  items: Ref<T[]>,
  itemsPerPage: Ref<number>
) {
  const currentPage = ref(1);

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage.value);
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return items.value.slice(start, end);
  });

  return { currentPage, totalPages, paginatedItems };
}