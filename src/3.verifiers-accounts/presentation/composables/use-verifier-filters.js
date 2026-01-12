import { computed, ref, unref } from 'vue';

/**
 * Composable para gestionar filtros de verificadores.
 * Encapsula lógica de filtrado por búsqueda global y estado.
 * Presentation Layer - Composable.
 * 
 * @param {Ref<Array> | Function} verifiers - Ref o getter function de array de verificadores
 * @returns {Object} Propiedades y métodos de filtrado
 */
export function useVerifierFilters(verifiers) {
  const globalFilterValue = ref('');
  const selectedStatus = ref(null);

  /**
   * Verificadores filtrados por búsqueda global y estado.
   */
  const filteredVerifiers = computed(() => {
    // Obtener el valor, ya sea de un ref, getter function, o valor directo
    const verifiersArray = typeof verifiers === 'function' ? verifiers() : unref(verifiers);
    
    // Validar que sea un array
    if (!Array.isArray(verifiersArray)) {
      return [];
    }
    
    let filtered = [...verifiersArray];

    // Filtro por búsqueda global
    if (globalFilterValue.value && globalFilterValue.value.trim().length > 0) {
      const searchTerm = globalFilterValue.value.toLowerCase().trim().replace(/\s+/g, ' ');
      filtered = filtered.filter(verifier =>
        (verifier.name && verifier.name.toLowerCase().includes(searchTerm)) ||
        (verifier.lastName && verifier.lastName.toLowerCase().includes(searchTerm)) ||
        (verifier.emailValue && verifier.emailValue.toLowerCase().includes(searchTerm)) ||
        (verifier.phoneValue && verifier.phoneValue.includes(searchTerm)) ||
        (verifier.fullName && verifier.fullName.toLowerCase().includes(searchTerm))
      );
    }

    // Filtro por estado
    if (selectedStatus.value) {
      filtered = filtered.filter(verifier => verifier.status === selectedStatus.value);
    }

    return filtered;
  });

  /**
   * Limpia todos los filtros.
   */
  function clearFilters() {
    globalFilterValue.value = '';
    selectedStatus.value = null;
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
   * Obtiene el conteo de verificadores por estado.
   * @param {string} status - Estado a contar
   * @returns {number} Cantidad de verificadores con ese estado
   */
  function getCountByStatus(status) {
    const verifiersArray = typeof verifiers === 'function' ? verifiers() : unref(verifiers);
    if (!Array.isArray(verifiersArray)) {
      return 0;
    }
    return verifiersArray.filter(v => v.status === status).length;
  }

  return {
    // State
    globalFilterValue,
    selectedStatus,
    filteredVerifiers,
    
    // Methods
    clearFilters,
    updateGlobalFilter,
    updateStatusFilter,
    getCountByStatus
  };
}
