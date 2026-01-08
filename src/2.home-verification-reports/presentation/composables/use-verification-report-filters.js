import { ref, computed } from 'vue';

/**
 * Composable para gestionar filtros de reportes de verificación.
 */
export function useVerificationReportFilters(getReports) {
  const globalFilterValue = ref('');
  const selectedStatus = ref('');

  const filteredReports = computed(() => {
    let filtered = getReports();

    // Filtro por búsqueda global
    if (globalFilterValue.value && globalFilterValue.value.trim().length > 0) {
      const searchLower = globalFilterValue.value.toLowerCase().trim();
      filtered = filtered.filter(report =>
        (report.code && report.code.toLowerCase().includes(searchLower)) ||
        (report.candidateName && report.candidateName.toLowerCase().includes(searchLower)) ||
        (report.verifierName && report.verifierName.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por estado
    if (selectedStatus.value) {
      filtered = filtered.filter(report => report.status === selectedStatus.value);
    }

    return filtered;
  });

  function updateGlobalFilter(value) {
    globalFilterValue.value = value;
  }

  function updateStatusFilter(value) {
    selectedStatus.value = value;
  }

  function clearFilters() {
    globalFilterValue.value = '';
    selectedStatus.value = '';
  }

  function getCountByStatus(status) {
    return getReports().filter(r => r.status === status).length;
  }

  return {
    globalFilterValue,
    selectedStatus,
    filteredReports,
    updateGlobalFilter,
    updateStatusFilter,
    clearFilters,
    getCountByStatus
  };
}
