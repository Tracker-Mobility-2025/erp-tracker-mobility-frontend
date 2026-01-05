import { ref, computed } from 'vue';

/**
 * Composable para manejar el filtrado avanzado de órdenes de verificación
 * @param {Array} orders - Array de órdenes a filtrar
 * @returns {Object} - Objeto con órdenes filtradas y métodos de filtrado
 */
export function useOrderFilters(orders) {
  const filters = ref({
    searchText: '',
    statuses: [],
    dateFrom: null,
    dateTo: null,
    companyId: null,
    verifierId: null,
    completeness: 'all',
    hasObservations: false,
    hasUnresolvedObservations: false,
    hasDocuments: false
  });

  /**
   * Filtra órdenes según los criterios activos
   */
  const filteredOrders = computed(() => {
    if (!orders.value || orders.value.length === 0) {
      return [];
    }

    return orders.value.filter(order => {
      // Filtro de búsqueda por texto
      if (filters.value.searchText) {
        const searchLower = filters.value.searchText.toLowerCase();
        const matchesSearch = 
          order.orderCodeValue?.toLowerCase().includes(searchLower) ||
          order.clientFullName?.toLowerCase().includes(searchLower) ||
          order.companyName?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por estados
      if (filters.value.statuses.length > 0) {
        if (!filters.value.statuses.includes(order.status)) {
          return false;
        }
      }

      // Filtro por fecha desde
      if (filters.value.dateFrom) {
        const orderDate = new Date(order.requestDate);
        const fromDate = new Date(filters.value.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        
        if (orderDate < fromDate) {
          return false;
        }
      }

      // Filtro por fecha hasta
      if (filters.value.dateTo) {
        const orderDate = new Date(order.requestDate);
        const toDate = new Date(filters.value.dateTo);
        toDate.setHours(23, 59, 59, 999);
        
        if (orderDate > toDate) {
          return false;
        }
      }

      // Filtro por empresa
      if (filters.value.companyId) {
        if (order.companyId !== filters.value.companyId) {
          return false;
        }
      }

      // Filtro por verificador
      if (filters.value.verifierId) {
        if (order.verifierId !== filters.value.verifierId) {
          return false;
        }
      }

      // Filtro por completitud
      if (filters.value.completeness === 'complete') {
        if (!order.isReportComplete) {
          return false;
        }
      } else if (filters.value.completeness === 'incomplete') {
        if (order.isReportComplete) {
          return false;
        }
      }

      // Filtro por observaciones
      if (filters.value.hasObservations) {
        if (!order.observations || order.observations.length === 0) {
          return false;
        }
      }

      // Filtro por observaciones sin resolver
      if (filters.value.hasUnresolvedObservations) {
        if (!order.hasUnresolvedObservations) {
          return false;
        }
      }

      // Filtro por documentos
      if (filters.value.hasDocuments) {
        if (!order.documents || order.documents.length === 0) {
          return false;
        }
      }

      return true;
    });
  });

  /**
   * Estadísticas de los resultados filtrados
   */
  const filterStats = computed(() => {
    const filtered = filteredOrders.value;
    
    return {
      total: filtered.length,
      pending: filtered.filter(o => o.status === 'PENDING' || o.status === 'ASSIGNED').length,
      inProgress: filtered.filter(o => o.status === 'IN_PROGRESS' || o.status === 'VERIFYING').length,
      completed: filtered.filter(o => o.status === 'COMPLETED').length,
      withObservations: filtered.filter(o => o.observations && o.observations.length > 0).length,
      complete: filtered.filter(o => o.isReportComplete).length,
      incomplete: filtered.filter(o => !o.isReportComplete).length
    };
  });

  /**
   * Actualiza los filtros
   */
  function updateFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }

  /**
   * Limpia todos los filtros
   */
  function clearFilters() {
    filters.value = {
      searchText: '',
      statuses: [],
      dateFrom: null,
      dateTo: null,
      companyId: null,
      verifierId: null,
      completeness: 'all',
      hasObservations: false,
      hasUnresolvedObservations: false,
      hasDocuments: false
    };
  }

  /**
   * Aplica un preset de filtros
   */
  function applyPreset(presetFilters) {
    filters.value = { ...filters.value, ...presetFilters };
  }

  /**
   * Exporta los datos filtrados a CSV
   */
  function exportToCSV() {
    const filtered = filteredOrders.value;
    if (filtered.length === 0) {
      return null;
    }

    // Headers
    const headers = [
      'Código de Orden',
      'Cliente',
      'Empresa',
      'Estado',
      'Fecha de Solicitud',
      'Verificador',
      'Fecha de Visita',
      'Completitud (%)',
      'Observaciones'
    ];

    // Rows
    const rows = filtered.map(order => [
      order.orderCodeValue || '',
      order.clientFullName || '',
      order.companyName || '',
      order.status || '',
      order.requestDate ? new Date(order.requestDate).toLocaleDateString('es-PE') : '',
      order.verifierName || 'Sin asignar',
      order.visitDate ? new Date(order.visitDate).toLocaleDateString('es-PE') : 'Sin programar',
      order.reportCompleteness || 0,
      order.observations ? order.observations.length : 0
    ]);

    // Build CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Descarga el CSV
   */
  function downloadCSV(filename = 'ordenes-verificacion.csv') {
    const csvContent = exportToCSV();
    if (!csvContent) {
      return false;
    }

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  }

  return {
    filters,
    filteredOrders,
    filterStats,
    updateFilters,
    clearFilters,
    applyPreset,
    exportToCSV,
    downloadCSV
  };
}
