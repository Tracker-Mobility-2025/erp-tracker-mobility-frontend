import { computed, ref, unref } from 'vue';

/**
 * Composable para gestionar filtros de órdenes de verificación.
 * Encapsula lógica de filtrado por búsqueda global, estado y fecha.
 * Presentation Layer - Composable.
 * 
 * @param {Ref<Array> | Function} orders - Ref o getter function de array de órdenes
 * @returns {Object} Propiedades y métodos de filtrado
 */
export function useVerificationOrderFilters(orders) {
  const globalFilterValue = ref('');
  const selectedStatus = ref(null);
  const dateRange = ref(null);

  /**
   * Órdenes filtradas por búsqueda global, estado y rango de fechas.
   */
  const filteredOrders = computed(() => {
    // Obtener el valor, ya sea de un ref, getter function, o valor directo
    const ordersArray = typeof orders === 'function' ? orders() : unref(orders);
    
    // Validar que sea un array
    if (!Array.isArray(ordersArray)) {
      return [];
    }
    
    let filtered = [...ordersArray];

    // Filtro por búsqueda global
    if (globalFilterValue.value && globalFilterValue.value.trim().length > 0) {
      const searchTerm = globalFilterValue.value.toLowerCase().trim().replace(/\s+/g, ' ');
      filtered = filtered.filter(order =>
        (order.orderCode && order.orderCode.toLowerCase().includes(searchTerm)) ||
        (order.clientName && order.clientName.toLowerCase().includes(searchTerm)) ||
        (order.companyName && order.companyName.toLowerCase().includes(searchTerm)) ||
        (order.verifierName && order.verifierName.toLowerCase().includes(searchTerm))
      );
    }

    // Filtro por estado
    if (selectedStatus.value) {
      filtered = filtered.filter(order => order.status === selectedStatus.value);
    }

    // Filtro por rango de fechas
    if (dateRange.value && dateRange.value.length === 2) {
      const [startDate, endDate] = dateRange.value;
      if (startDate && endDate) {
        filtered = filtered.filter(order => {
          if (!order.visitDate) return false;
          const orderDate = new Date(order.visitDate);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }
    }

    return filtered;
  });

  /**
   * Limpia todos los filtros.
   */
  function clearFilters() {
    globalFilterValue.value = '';
    selectedStatus.value = null;
    dateRange.value = null;
  }

  /**
   * Actualiza el valor del filtro global.
   * @param {string} value - Nuevo valor del filtro
   */
  function updateGlobalFilter(value) {
    globalFilterValue.value = value || '';
  }

  /**
   * Actualiza el filtro de estado.
   * @param {string|null} status - Estado seleccionado
   */
  function updateStatusFilter(status) {
    selectedStatus.value = status;
  }

  /**
   * Actualiza el filtro de rango de fechas.
   * @param {Array|null} range - Rango de fechas [startDate, endDate]
   */
  function updateDateRangeFilter(range) {
    dateRange.value = range;
  }

  /**
   * Obtiene el conteo de órdenes por estado.
   * @param {string} status - Estado a contar
   * @returns {number} Cantidad de órdenes con ese estado
   */
  function getCountByStatus(status) {
    const ordersArray = typeof orders === 'function' ? orders() : unref(orders);
    if (!Array.isArray(ordersArray)) {
      return 0;
    }
    return ordersArray.filter(o => o.status === status).length;
  }

  return {
    // State
    globalFilterValue,
    selectedStatus,
    dateRange,
    filteredOrders,
    
    // Methods
    clearFilters,
    updateGlobalFilter,
    updateStatusFilter,
    updateDateRangeFilter,
    getCountByStatus
  };
}
