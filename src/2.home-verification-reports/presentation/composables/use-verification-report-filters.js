import { ref, computed } from 'vue';

/**
 * Composable para gestionar filtros de reportes de verificación.
 */
export function useVerificationReportFilters(getReports) {
  const globalFilterValue = ref('');
  const selectedStatus = ref('');
  const selectedValidationStatus = ref('');

  const filteredReports = computed(() => {
    let filtered = getReports();

    // Filtro por búsqueda global
    if (globalFilterValue.value && globalFilterValue.value.trim().length > 0) {
      // Normalizar término de búsqueda: minúsculas, eliminar espacios extras
      const searchTerm = globalFilterValue.value.toLowerCase().trim().replace(/\s+/g, ' ');
      
      // Helper para normalizar texto: minúsculas + espacios simples
      const normalizeText = (text) => {
        if (!text) return '';
        return String(text).toLowerCase().trim().replace(/\s+/g, ' ');
      };
      
      filtered = filtered.filter(report => {
        // Normalizar cada campo antes de comparar
        const reportCode = normalizeText(report.reportCode);
        const orderCode = normalizeText(report.orderCode);
        const clientName = normalizeText(report.clientName);
        const companyName = normalizeText(report.companyName);
        
        // Buscar coincidencias parciales en cualquiera de los campos
        return reportCode.includes(searchTerm) ||
               orderCode.includes(searchTerm) ||
               clientName.includes(searchTerm) ||
               companyName.includes(searchTerm);
      });
    }

    // Filtro por estado de resultado
    if (selectedStatus.value) {
      filtered = filtered.filter(report => report.finalResult === selectedStatus.value);
    }

    // Filtro por estado de validación
    if (selectedValidationStatus.value !== '') {
      const isValid = selectedValidationStatus.value === 'validated';
      filtered = filtered.filter(report => report.isResultValid === isValid);
    }

    return filtered;
  });

  function updateGlobalFilter(value) {
    globalFilterValue.value = value;
  }

  function updateStatusFilter(value) {
    selectedStatus.value = value;
  }

  function updateValidationStatusFilter(value) {
    selectedValidationStatus.value = value;
  }

  function clearFilters() {
    globalFilterValue.value = '';
    selectedStatus.value = '';
    selectedValidationStatus.value = '';
  }

  function getCountByStatus(status) {
    return getReports().filter(r => r.finalResult === status).length;
  }

  function getCountByValidationStatus(isValid) {
    return getReports().filter(r => r.isResultValid === isValid).length;
  }

  return {
    globalFilterValue,
    selectedStatus,
    selectedValidationStatus,
    filteredReports,
    updateGlobalFilter,
    updateStatusFilter,
    updateValidationStatusFilter,
    clearFilters,
    getCountByStatus,
    getCountByValidationStatus
  };
}
