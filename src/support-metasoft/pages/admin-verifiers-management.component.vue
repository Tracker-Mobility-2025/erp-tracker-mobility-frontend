<script>
import DataManager from "../../shared/components/data-manager.component.vue";
import {Verifier} from "../../tracker-mobility/verifier-management/models/verifiers.entity.js";
import {VerifierApiService} from "../../tracker-mobility/verifier-management/services/verifier-api.service.js";
import {NotificationMixin} from "../../shared/utils/notification.utils.js";

export default {
  name: 'admin-verifiers-management',
  components: {DataManager},

  mixins: [NotificationMixin],

  data() {
    return {
      // Servicio de verificador
      verifierApiService: null,

      // Array de verificadores
      itemsArray: [],

      // Definición de columnas para la tabla
      columns: [
        { field: 'id', header: 'ID', sortable: true, style: 'width: 80px;' },
        { field: 'name', header: 'Nombres', sortable: true, style: 'width: 160px;' },
        { field: 'lastName', header: 'Apellidos', sortable: true, style: 'width: 160px;' },
        { field: 'email', header: 'Email', sortable: true, style: 'width: 220px;' },
        { field: 'phoneNumber', header: 'Teléfono', sortable: true, style: 'width: 140px;' },
        { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
      ],

      // Filtros
      globalFilterValue: '',
      selectedStatus: null,
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Activo', value: 'ACTIVE' },
        { label: 'Inactivo', value: 'INACTIVE' },
      ],

      title: {
        singular: 'verificador',
        plural: 'verificadores',
      },

      loading: false,
      hasLoadingError: false,
      loadingTimeout: null,
      loadingTimeoutDuration: 15000 // 15 segundos
    }
  },

  computed: {
    // Filtro combinado que aplica todos los filtros activos
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro por búsqueda global
      if (this.globalFilterValue && this.globalFilterValue.trim().length > 0) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim().replace(/\s+/g, ' ');
        filtered = filtered.filter(verifier =>
          (verifier.name && verifier.name.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (verifier.lastName && verifier.lastName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (verifier.email && verifier.email.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (verifier.phoneNumber && String(verifier.phoneNumber).toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (verifier.dni && String(verifier.dni).toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm))
        );
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(verifier => verifier.status === this.selectedStatus);
      }

      return filtered;
    }
  },

  methods: {
    // Limpiar todos los filtros
    onClearFilters() {
      this.globalFilterValue = '';
      this.selectedStatus = null;
    },

    // Actualizar el valor del filtro global
    onGlobalFilterChange(value) {
      this.globalFilterValue = value || '';
    },

    // Retorna la clase CSS para el estado
    getStatusClass(status) {
      const statusMap = {
        'ACTIVE': 'status-activo',
        'INACTIVE': 'status-inactivo'
      };
      return statusMap[status] || 'status-default';
    },

    // Retorna la cantidad de verificadores por estado
    getCountByStatus(status) {
      return this.itemsArray.filter(v => v.status === status).length;
    },

    // Ver detalles del verificador
    onViewItem(item) {
      console.log('Ver detalles del verificador:', item);

      this.showToast({
        severity: 'info',
        summary: 'Información',
        detail: `Visualizando verificador: ${item.name} ${item.lastName}`,
        life: 3000
      });

      // Aquí puedes navegar a una página de detalles si existe
      // this.$router.push({ name: 'verifier-details', query: { id: item.id } });
    },

    // Eliminar un verificador individual
    onDeleteItem(item) {
      console.log('[DELETE] Eliminar verificador:', item);

      this.verifierApiService.delete(item.id)
        .then(() => {
          // Eliminar del array local
          const index = this.itemsArray.findIndex(verifier => verifier.id === item.id);
          if (index > -1) {
            this.itemsArray.splice(index, 1);
          }

          console.log('[DELETE] Verificador eliminado exitosamente:', item.id);

          // Mostrar mensaje de éxito
          this.showToast({
            severity: 'success',
            summary: 'Verificador eliminado',
            detail: `El verificador ${item.name} ${item.lastName} ha sido eliminado exitosamente`,
            life: 4000
          });
        })
        .catch(error => {
          console.error('[DELETE] Error al eliminar verificador:', error);

          // Determinar el mensaje de error apropiado
          let errorDetail = `No se pudo eliminar el verificador ${item.name} ${item.lastName}.`;

          if (error.response) {
            const status = error.response.status;
            if (status === 404) {
              errorDetail = 'El verificador no existe o ya fue eliminado.';
            } else if (status === 409) {
              errorDetail = 'No se puede eliminar el verificador porque tiene órdenes asignadas.';
            } else if (status >= 500) {
              errorDetail = 'Error interno del servidor. Por favor, intente más tarde.';
            } else if (error.response.data?.message) {
              errorDetail = error.response.data.message;
            }
          } else if (error.request) {
            errorDetail = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
          }

          // Mostrar mensaje de error
          this.showToast({
            severity: 'error',
            summary: 'Error al eliminar',
            detail: errorDetail,
            life: 5000
          });
        });
    },

    // Eliminar múltiples verificadores seleccionados
    onDeleteSelectedItems(selectedItems) {
      console.log('[DELETE-MULTIPLE] Eliminar verificadores seleccionados:', selectedItems.length);

      if (!selectedItems || selectedItems.length === 0) {
        this.showToast({
          severity: 'warn',
          summary: 'Sin selección',
          detail: 'No hay verificadores seleccionados para eliminar.',
          life: 3000
        });
        return;
      }

      // Mostrar toast informativo del proceso
      this.showToast({
        severity: 'info',
        summary: 'Eliminando verificadores',
        detail: `Procesando eliminación de ${selectedItems.length} verificador(es)...`,
        life: 3000
      });

      // Contadores para resultados
      let successCount = 0;
      let errorCount = 0;
      const totalCount = selectedItems.length;

      // Procesar eliminación de cada verificador
      const deletePromises = selectedItems.map(item => {
        return this.verifierApiService.delete(item.id)
          .then(() => {
            successCount++;
            // Eliminar del array local
            const index = this.itemsArray.findIndex(v => v.id === item.id);
            if (index > -1) {
              this.itemsArray.splice(index, 1);
            }
            console.log('[DELETE-MULTIPLE] Verificador eliminado:', item.id);
          })
          .catch(error => {
            errorCount++;
            console.error('[DELETE-MULTIPLE] Error al eliminar verificador:', item.id, error);
          });
      });

      // Esperar a que todas las eliminaciones terminen
      Promise.all(deletePromises)
        .finally(() => {
          // Mostrar resumen de resultados
          if (successCount === totalCount) {
            // Todas las eliminaciones fueron exitosas
            this.showToast({
              severity: 'success',
              summary: 'Eliminación completada',
              detail: `Se eliminaron ${successCount} verificador(es) exitosamente`,
              life: 5000
            });
          } else if (errorCount === totalCount) {
            // Todas las eliminaciones fallaron
            this.showToast({
              severity: 'error',
              summary: 'Error en eliminación',
              detail: `No se pudo eliminar ningún verificador. Por favor, intente nuevamente.`,
              life: 5000
            });
          } else {
            // Eliminación parcial
            this.showToast({
              severity: 'warn',
              summary: 'Eliminación parcial',
              detail: `Se eliminaron ${successCount} de ${totalCount} verificador(es). ${errorCount} fallaron.`,
              life: 6000
            });
          }
        });
    },

    // Función modular para manejar errores de servidor
    handleServerError(error, context = 'datos') {
      console.error(`Error al cargar ${context}:`, error);

      let errorMessage = '';
      let showToast = false;

      if (error.response) {
        const status = error.response.status;
        showToast = true;

        if (status >= 500) {
          errorMessage = `Error interno del servidor al cargar ${context}. Por favor, contacte al administrador.`;
        } else if (status >= 400) {
          errorMessage = `Error en la solicitud de ${context}. Verifique los permisos de acceso.`;
        } else {
          errorMessage = `Error del servidor (${status}) al cargar ${context}.`;
        }
      } else if (error.request) {
        showToast = true;
        errorMessage = `No se pudo conectar con el servidor para cargar ${context}. Verifique su conexión a internet.`;
      }

      if (showToast) {
        this.showToast({
          severity: 'error',
          summary: 'Error del servidor',
          detail: errorMessage,
          life: 7000
        });
      }
    },

    // Validar respuesta del servidor
    validateServerResponse(response, context = 'datos') {
      if (!response || !response.hasOwnProperty('data') || !Array.isArray(response.data)) {
        throw new Error(`Formato de ${context} inválido del servidor`);
      }
      return true;
    },

    // Obtener todos los verificadores
    getAllVerifiers() {
      this.loading = true;
      this.hasLoadingError = false;

      // Configurar timeout para detectar carga lenta
      this.loadingTimeout = setTimeout(() => {
        if (this.loading) {
          this.hasLoadingError = true;
          console.warn('La carga de datos está tomando más tiempo del esperado');
        }
      }, this.loadingTimeoutDuration);

      this.verifierApiService.getAll()
        .then(response => {
          // Validar respuesta
          this.validateServerResponse(response, 'verificadores');

          // Mapear los datos del API a instancias de Verifier
          this.itemsArray = response.data.map(verifierData => new Verifier(verifierData));

          // Ordenar por nombre
          this.itemsArray.sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });

          this.hasLoadingError = false;
          console.log('Verificadores cargados:', this.itemsArray.length);

          this.showToast({
            severity: 'success',
            summary: 'Datos cargados',
            detail: `Se cargaron ${this.itemsArray.length} verificadores exitosamente`,
            life: 3000
          });
        })
        .catch(error => {
          this.itemsArray = [];
          this.hasLoadingError = true;
          this.handleServerError(error, 'los verificadores');
        })
        .finally(() => {
          // Limpiar timeout
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
          }
          this.loading = false;
        });
    },

    // Método para reintentar la carga de datos
    retryLoadData() {
      this.getAllVerifiers();
    }
  },

  created() {
    console.log('[ADMIN-VERIFIERS] Inicializando módulo administrativo de verificadores');

    // Inicializar servicio
    this.verifierApiService = new VerifierApiService('/verifiers');

    // Cargar todos los verificadores
    this.getAllVerifiers();
  },

  beforeUnmount() {
    // Limpiar timeout si existe al destruir el componente
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }
}
</script>

<template>
  <div class="h-full overflow-hidden flex flex-column p-4">
    <!-- Header con título + descripción -->
    <div class="flex justify-content-between align-items-center mb-1">
      <div class="flex flex-column">
        <h2 class="text-3xl font-bold mb-2">Gestión Administrativa de Verificadores</h2>
        <p class="text-color-secondary">Visualiza y administra todos los verificadores del sistema</p>
      </div>
    </div>

    <!-- Mensaje de advertencia si la carga toma mucho tiempo -->
    <pv-message
      v-if="loading && hasLoadingError"
      severity="warn"
      :closable="false"
      class="mb-3"
    >
      <div class="flex align-items-center justify-content-between w-full">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-spin pi-spinner"></i>
          <span>La carga está tomando más tiempo del esperado. Por favor, espere o intente recargar.</span>
        </div>
        <pv-button
          label="Recargar"
          icon="pi pi-refresh"
          class="p-button-sm p-button-warning"
          @click="retryLoadData"
        />
      </div>
    </pv-message>

    <!-- Mensaje de error si la carga falló -->
    <pv-message
      v-if="!loading && hasLoadingError && itemsArray.length === 0"
      severity="error"
      :closable="false"
      class="mb-3"
    >
      <div class="flex align-items-center justify-content-between w-full">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-exclamation-triangle"></i>
          <span>No se pudieron cargar los verificadores. Por favor, intente nuevamente.</span>
        </div>
        <pv-button
          label="Reintentar"
          icon="pi pi-refresh"
          class="p-button-sm p-button-danger"
          @click="retryLoadData"
        />
      </div>
    </pv-message>

    <!-- Componente DataManager para gestionar verificadores -->
    <data-manager
      :items="itemsArray"
      :filtered-items="filteredItemsArray"
      :global-filter-value="globalFilterValue"
      :columns="columns"
      :title="title"
      :loading="loading"
      :dynamic="true"
      :show-new="false"
      :show-delete="true"
      :show-export="true"
      :show-selection="true"
      :show-actions="true"
      :show-action-buttons="true"
      :show-edit-action="false"
      :show-delete-action="true"
      :show-view-action="true"
      :rows="15"
      :rows-per-page-options="[10, 15, 20, 50, 100]"
      export-button-label="Exportar a CSV"
      delete-button-label="Eliminar seleccionados"
      search-placeholder="Buscar por nombre, apellido, email, teléfono..."
      @delete-selected-items-requested-manager="onDeleteSelectedItems"
      @delete-item-requested-manager="onDeleteItem"
      @view-item-requested-manager="onViewItem"
      @global-filter-change="onGlobalFilterChange"
      @clear-filters="onClearFilters"
    >
      <!-- Filtros personalizados -->
      <template #filters="{ clearFilters }">
        <div class="flex align-items-center gap-2">
          <!-- Filtro por estado -->
          <pv-select
            v-model="selectedStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Estado: Todos"
            class="flex-1 h-full"
          >
            <template #option="slotProps">
              <div class="flex align-items-center justify-content-between w-full">
                <span>{{ slotProps.option.label }}</span>
                <span
                  v-if="slotProps.option.value !== null"
                  class="badge-custom ml-2"
                  :class="getStatusClass(slotProps.option.value)"
                >
                  {{ getCountByStatus(slotProps.option.value) }}
                </span>
                <span
                  v-else
                  class="badge-custom ml-2 status-default"
                >
                  {{ itemsArray.length }}
                </span>
              </div>
            </template>
          </pv-select>

          <!-- Botón para limpiar filtros -->
          <pv-button
            label="Limpiar filtros"
            icon="pi pi-filter-slash"
            @click="onClearFilters()"
            class="p-button-secondary flex-shrink-0 h-full"
          />
        </div>
      </template>

      <!-- Template personalizado para la columna de estado -->
      <template #status="{ data }">
        <span
          class="status-tag"
          :class="getStatusClass(data.status)"
        >
          {{ data.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO' }}
        </span>
      </template>
    </data-manager>
  </div>
</template>

<style scoped>
/* Badges personalizados para filtros */
.badge-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5rem;
}

/* Tags de estado personalizados */
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

/* Color secundario para texto */
.text-color-secondary {
  color: var(--color-muted);
}
</style>

