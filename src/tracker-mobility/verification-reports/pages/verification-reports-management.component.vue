<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import {ReportApiService} from "../services/reports-api.service.js";
import {VerificationReportSummary} from "../models/verification-report-summary.entity.js";

export default {
  name: 'verification-reports-management',
  components: {DataManager},

  data(){
    return {

      // Servicio para manejar reportes de verificación
      reportVerificationManagementApiService: new ReportApiService('/reports'),

      itemsArray:[],

      columns: [
        { field: 'reportCode', header: 'Código Informe', sortable: true, style: 'width: 150px;' },
        { field: 'orderCode', header: 'Código Orden', sortable: true, style: 'width: 150px;' },
        { field: 'clientName', header: 'Cliente', sortable: true, style: 'width: 200px;' },
        { field: 'companyName', header: 'Empresa Solicitante', sortable: true, style: 'width: 200px;' },
        { field: 'requestDate', header: 'Fecha Solicitud', sortable: true, template: 'requestDate', style: 'width: 140px;' },
        { field: 'finalResult', header: 'Resultado', sortable: true, template: 'result', style: 'width: 120px;' },
      ],

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedDate: null, // Fecha seleccionada en el filtro
      selectedStatus: null, // Estado seleccionado en el filtro
      statusOptions: [      // Opciones de estado para el filtro
        { label: 'Todos', value: null },
        { label: 'Conforme', value: 'CONFORME' },
        { label: 'Observado', value: 'OBSERVADO' },
        { label: 'Rechazado', value: 'RECHAZADO' },
        { label: 'Ent Faltante', value: 'ENTREVISTA_ARRENDADOR_FALTANTE' },
      ],

      title: {
        singular: 'informe de visita domiciliaria',
        plural: 'informes de visitas domiciliarias',
      },

      loading: false,

    }
  },

  computed: {
    // Filtro combinado que aplica todos los filtros activos
    filteredItemsArray() {
      let filtered = [...this.itemsArray]; // Copia del array original para filtrar sin mutar el original

      // Filtro por búsqueda global (nombre de cliente, código reporte, código orden, empresa)
      // Solo aplicar filtro si hay contenido real (no null, no undefined, no string vacío o solo espacios)
      if (this.globalFilterValue && this.globalFilterValue.trim().length > 0) {
        // Normalizar el término de búsqueda: quitar espacios extra y convertir a minúsculas
        const searchTerm = this.globalFilterValue.toLowerCase().trim().replace(/\s+/g, ' ');
        filtered = filtered.filter(report =>
          (report.clientName && report.clientName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (report.reportCode && report.reportCode.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (report.orderCode && report.orderCode.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (report.companyName && report.companyName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm))
        );
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(report => report.finalResult === this.selectedStatus);
      }

      // Filtro por fecha seleccionada (corregido para zona horaria)
      if (this.selectedDate) {
        const selectedDateStr = this.dateToComparableString(this.selectedDate);
        if (selectedDateStr) {
          filtered = filtered.filter(report => {
            const reportDateStr = this.normalizeDateForComparison(report.requestDate);
            return reportDateStr === selectedDateStr;
          });
        }
      }

      return filtered;
    }
  },

  methods: {

    onNewItemRequested() {
      console.log('Crear nueva orden de verificación');
      // Implementar navegación a formulario de creación
    },

    onDeleteSelectedItems(selectedItems) {
      console.log('Eliminar órdenes seleccionadas:', selectedItems);
      // Implementar lógica de eliminación múltiple
      selectedItems.forEach(item => {
        const index = this.itemsArray.findIndex(result => result.id === item.id);
        if (index > -1) {
          this.itemsArray.splice(index, 1);
        }
      });
    },

    onDeleteItem(item) {
      console.log('Eliminar orden:', item);
      // Implementar lógica de eliminación individual
      const index = this.itemsArray.findIndex(order => order.id === item.id);
      if (index > -1) {
        this.itemsArray.splice(index, 1);
      }
    },

    onEditItem(item) {
      console.log('Editar orden:', item);
      // Implementar navegación a formulario de edición
    },

    onViewItem(item) {
      console.log('Ver detalles de informe:', item);
      // Navegar a vista de detalles pasando el ID del informe
      this.$router.push({ 
        name: 'verification-reports-details', 
        query: { id: item.reportId } 
      });
    },

    onRowSelect(event) {
      console.log('Fila seleccionada:', event);
    },

    onRowUnselect(event) {
      console.log('Fila deseleccionada:', event);
    },

    onClearFilters() {
      this.globalFilterValue = '';
      this.selectedStatus = null;
      this.selectedDate = null;
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value || '';
    },

    // Retorna el color personalizado para el resultado final
    getStatusColor(status) {
      switch (status) {
        case 'CONFORME':
          return '#4CAF50'; // Verde
        case 'OBSERVADO':
          return '#FB8C00'; // Naranja
        case 'RECHAZADO':
          return '#D32F2F'; // Rojo
        case 'ENTREVISTA_ARRENDADOR_FALTANTE':
          return '#9C27B0'; // Púrpura
        default:
          return '#E0E0E0';
      }
    },

    // Retorna si debe usar texto blanco
    shouldUseWhiteText(status) {
      return ['CONFORME', 'OBSERVADO', 'RECHAZADO', 'ENTREVISTA_ARRENDADOR_FALTANTE'].includes(status);
    },

    // Obtener cantidad de reportes por resultado
    getCountByStatus(status) {
      return this.itemsArray.filter(r => r.finalResult === status).length;
    },

    // Formatear el texto del estado para visualización
    getStatusLabel(status) {
      if (status === 'ENTREVISTA_ARRENDADOR_FALTANTE') {
        return 'ENT FALTANTE';
      }
      return status;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        // Manejar diferentes formatos de fecha de entrada
        let dateToFormat;
        
        if (dateString.includes('T')) {
          // Si tiene formato ISO con hora, extraer solo la fecha
          const datePart = dateString.split('T')[0];
          const [year, month, day] = datePart.split('-');
          // Crear fecha usando componentes individuales para evitar zona horaria
          dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (dateString.includes('-')) {
          // Si es formato YYYY-MM-DD
          const [year, month, day] = dateString.split('-');
          dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          // Fallback para otros formatos
          dateToFormat = new Date(dateString);
        }
        
        // Verificar que la fecha sea válida
        if (isNaN(dateToFormat.getTime())) return dateString;
        
        // Formatear como dd/mm/aaaa usando los métodos locales
        const day = dateToFormat.getDate().toString().padStart(2, '0');
        const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
        const year = dateToFormat.getFullYear();
        
        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return dateString;
      }
    },

    // Función para normalizar fechas y evitar problemas de zona horaria
    normalizeDateForComparison(dateString) {
      if (!dateString) return null;
      
      try {
        // Crear fecha desde string de API (formato YYYY-MM-DD)
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        
        // Retornar solo la parte de la fecha (YYYY-MM-DD) sin hora
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error al normalizar fecha:', error);
        return null;
      }
    },

    // Función para convertir Date de calendario a string comparable
    dateToComparableString(dateObject) {
      if (!dateObject) return null;
      
      try {
        // Asegurar que es un objeto Date válido
        const date = dateObject instanceof Date ? dateObject : new Date(dateObject);
        if (isNaN(date.getTime())) return null;
        
        // Usar fecha local para evitar problemas de zona horaria
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Error al convertir fecha del calendario:', error);
        return null;
      }
    },

    // Función modular para manejar errores de servidor
    handleServerError(error, context = 'datos') {
      console.error(`Error al cargar ${context}:`, error);

      // Determinar si mostrar toast basado en el tipo de error
      let errorMessage = '';
      let showToast = false;

      if (error.response) {
        // Error de respuesta del servidor (4xx, 5xx)
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
        // Error de red o conexión
        showToast = true;
        errorMessage = `No se pudo conectar con el servidor para cargar ${context}. Verifique su conexión a internet.`;
      } else if (error.message && (error.message.includes('inválido') || error.message.includes('formato'))) {
        // Error de formato de datos del servidor
        showToast = true;
        errorMessage = `Error en el formato de datos del servidor: ${error.message}`;
      }
      
      if (showToast) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error del servidor',
          detail: errorMessage,
          life: 7000
        });
      }
    },

    // Función modular para validar respuesta del servidor
    validateServerResponse(response, context = 'datos') {
      if (!response || !response.hasOwnProperty('data') || !Array.isArray(response.data)) {
        throw new Error(`Formato de ${context} inválido del servidor`);
      }
      return true;
    },

    getAll() {
      this.loading = true;
      this.reportVerificationManagementApiService.getAllSummary().then(response => {
        // Validar respuesta usando función modular
        this.validateServerResponse(response, 'informes de verificación');

        // Si el array está vacío, es una respuesta válida, no un error
        if (response.data.length === 0) {
          console.log('No hay informes de verificación disponibles');
          this.itemsArray = [];
          return; // Salir sin mostrar error, la tabla mostrará el mensaje "No se encontraron registros"
        }

        // Mapear los datos de la API usando VerificationReportSummary
        this.itemsArray = response.data.map(item => new VerificationReportSummary(item));

        console.log('Informes de verificación resumidos cargados:', this.itemsArray.length);

      }).catch(error => {
        this.itemsArray = []; // Limpiar datos en caso de error
        this.handleServerError(error, 'los informes de verificación');
      }).finally(() => {
        this.loading = false;
      });
    }



  },



  created() {
    // Inicialización del servicio API - usar el endpoint correcto
    this.reportVerificationManagementApiService = new ReportApiService('/reports');
    
    // Cargar datos al inicializar el componente
    this.getAll();
  }


};

</script>

<template>
  <!-- NOTA: pv-toast eliminado - se usa el global de App.vue para evitar duplicados -->

  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-3xl font-bold mb-2"> Reportes de visitas domiciliarias </h2>
    <p> Informes detallados de las visitas domiciliarias para las órdenes de servicio </p>

    <data-manager
        :items="itemsArray"
        :filtered-items="filteredItemsArray"
        :global-filter-value="globalFilterValue"
        :columns="columns"
        :title="title"
        :loading="loading"
        :dynamic="true"
        :show-new="false"
        :show-delete="false"
        :show-export="false"
        :show-selection="true"
        :show-actions="true"
        :show-action-buttons="true"
        :rows="10"
        :rows-per-page-options="[5, 10, 15, 20, 50]"
        new-button-label="Nueva Orden"
        delete-button-label="Eliminar"
        export-button-label="Exportar"
        search-placeholder="Busca por código, cliente, empresa solicitante..."
        @new-item-requested-manager="onNewItemRequested"
        @delete-selected-items-requested-manager="onDeleteSelectedItems"
        @delete-item-requested-manager="onDeleteItem"
        @edit-item-requested-manager="onEditItem"
        @view-item-requested-manager="onViewItem"
        @row-select="onRowSelect"
        @row-unselect="onRowUnselect"
        @global-filter-change="onGlobalFilterChange"
        @clear-filters="onClearFilters"
    >
      <!-- Filtro personalizado para el estado -->
      <template #filters="{ clearFilters }" >
        <div class="flex align-items-center gap-2">
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
                  :style="{
                    backgroundColor: getStatusColor(slotProps.option.value),
                    color: shouldUseWhiteText(slotProps.option.value) ? '#FFFFFF' : '#000000'
                  }"
                >
                  {{ getCountByStatus(slotProps.option.value) }}
                </span>
                <span 
                  v-else
                  class="badge-custom ml-2"
                  style="background-color: #E0E0E0; color: #000000;"
                >
                  {{ itemsArray.length }}
                </span>
              </div>
            </template>
          </pv-select>
          <!-- Filtro por fecha -->
          <pv-calendar
              id="visitDate"
              v-model="selectedDate"
              placeholder="dd/mm/aaaa"
              dateFormat="dd/mm/yy"
              show-icon
              class="flex-1 h-full"
          />
          <!-- Botón para limpiar filtros específicos -->
          <pv-button
              label="Limpiar filtros"
              icon="pi pi-filter-slash"
              @click="onClearFilters()"
              class="p-button-secondary flex-shrink-0 h-full"
          />

        </div>
      </template>


      <!-- Template para el campo "result" -->
      <template #result="{ data }">
        <span 
          class="status-tag"
          :style="{
            backgroundColor: getStatusColor(data.finalResult),
            color: shouldUseWhiteText(data.finalResult) ? '#FFFFFF' : '#000000'
          }"
        >
          {{ getStatusLabel(data.finalResult) }}
        </span>
      </template>

      <!-- Template para el campo "requestDate" -->
      <template #requestDate="{ data }">
        <span>{{ formatDate(data.requestDate) }}</span>
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

/* Estilos usando variables CSS corporativas */
.text-orange-500 {
  color: var(--color-warning) !important;
}


/* Los estilos de botones ahora son globales en style.css */

/* Los estilos de input y dropdown ahora son globales en style.css */

/* Los estilos de tags y checkboxes ahora son globales en style.css */

/* Los estilos de botones de acción, paginador, tabla y toolbar ahora son globales en style.css */

</style>