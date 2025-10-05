<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import VerifierCreateAndEdit from "../components/verifier-create-and-edit.component.vue";
import {Verifier} from "../models/verifiers.entity.js";
import {VerifierApiService} from "../services/verifier-api.service.js";
import {CreateVerifier} from "../models/create-verifier.entity.js";
import {useAuthenticationStore} from "../../security/services/authentication.store.js";

export default {
  name: 'verifiers-management',
  components: {VerifierCreateAndEdit, DataManager},

  data() {
    return {

      adminId: null, // ID del administrador actual (simulado)
      createItem: new CreateVerifier({}), // Nuevo verificador a crear
      item: null, // Verificador actual para edición o creación

      // Servicio de verificador
      verifierManagementApiServices: null,

      itemsArray: [],

      columns: [
        { field: 'name', header: 'Nombres', sortable: true, style: 'width: 160px;' },
        { field: 'lastName', header: 'Apellidos', sortable: true, style: 'width: 160px;' },
        { field: 'email', header: 'Email', sortable: true, style: 'width: 200px;' },
        { field: 'phoneNumber', header: 'Teléfono', sortable: true, style: 'width: 140px;' },
        { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
      ],

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedStatus: null, // Estado seleccionado en el filtro
      statusOptions: [      // Opciones de estado para el filtro
        { label: 'Todos', value: null },
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' },
      ],

      title: {
        singular: 'verificador',
        plural: 'verificadores',
      },

      loading: false,



      // Control para el diálogo de creación/edición
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,


    }
  },

  computed: {
    // Filtro combinado que aplica todos los filtros activos
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro por búsqueda global (nombre, apellido, email, teléfono)
      // Solo aplicar filtro si hay contenido real (no null, no undefined, no string vacío o solo espacios)
      if (this.globalFilterValue && this.globalFilterValue.trim().length > 0) {
        // Normalizar el término de búsqueda: quitar espacios extra y convertir a minúsculas
        const searchTerm = this.globalFilterValue.toLowerCase().trim().replace(/\s+/g, ' ');
        filtered = filtered.filter(verifier =>
          (verifier.name && verifier.name.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (verifier.lastName && verifier.lastName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (verifier.email && verifier.email.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (verifier.phoneNumber && verifier.phoneNumber.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm))
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

    onNewItem() {
      console.log('Crear un nuevo verificador');
      this.createItem = new CreateVerifier({});

      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteSelectedItems(selectedItems) {
      this.selectedItems = selectedItems;
      this.deleteSelectedItems();
    },

    onDeleteItem(item) {
      console.log('Eliminar verificador:', item);
      
      this.verifierManagementApiServices.delete(item.id).then(response => {
        // Eliminar del array local
        const index = this.itemsArray.findIndex(verifier => verifier.id === item.id);
        if (index > -1) {
          this.itemsArray.splice(index, 1);
        }
        
        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Verificador eliminado',
          detail: `El verificador ${item.name} ${item.lastName} ha sido eliminado exitosamente`,
          life: 4000
        });
        
      }).catch(error => {
        console.error('Error al eliminar verificador:', error);
        
        // Mostrar mensaje de error
        this.$toast.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: `No se pudo eliminar el verificador ${item.name} ${item.lastName}`,
          life: 4000
        });
      });
    },

    onViewItem(item) {
      console.log('Ver detalles de orden:', item);

      this.$router.push({
        name: 'verifier-details',
        query: { id: item.id }
      });
    },

    onClearFilters() {
      this.globalFilterValue = '';
      this.selectedStatus = null;
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value || '';
    },

    getStatusItemsArray(status) {
      switch (status) {
        case 'ACTIVO' || 'ACTIVE':
          return 'success';
        case 'INACTIVO' || 'INACTIVE':
          return 'danger';
        default:
          return 'info';
      }
    },

    onCancelRequested() {
      console.log('Cancelado creación/edición de verificador');
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSaveRequested(item) {
      this.createItem = new CreateVerifier(item);

      console.log('Guardar verificador creado:', this.createItem);

      this.submitted = true;

      this.create();

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;

    },

    update(){

    },

    create() {

      this.createItem.adminId = this.adminId; // Asignar adminId simulado

      console.log('Creando verificador:', this.createItem);

      this.verifierManagementApiServices.create(this.createItem).then(response => {

        let newItem = new Verifier(response.data);

        this.itemsArray.push(newItem);

        console.log('Verificador creado:', response.data);

        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Verificador creado',
          detail: `El verificador ${newItem.name} ${newItem.lastName} ha sido creado exitosamente`,
          life: 4000
        });

      }).catch(error => {
        console.error('Error al crear verificador:', error);
        
        // Mostrar mensaje de error
        this.$toast.add({
          severity: 'error',
          summary: 'Error al crear verificador',
          detail: 'No se pudo crear el verificador. Por favor, intente nuevamente.',
          life: 4000
        });
      });

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

    deleteSelectedItems(){
      const totalItems = this.selectedItems.length;
      let deletedCount = 0;
      let errorCount = 0;

      this.selectedItems.forEach((variable) => {
        this.verifierManagementApiServices.delete(variable.id).then(response => {

          this.itemsArray = this.itemsArray.filter(item => item.id !== variable.id);
          deletedCount++;
          
          // Mostrar mensaje cuando se complete la eliminación de todos los elementos
          if (deletedCount + errorCount === totalItems) {
            if (errorCount === 0) {
              this.$toast.add({
                severity: 'success',
                summary: 'Verificadores eliminados',
                detail: `${deletedCount} verificador${deletedCount > 1 ? 'es' : ''} eliminado${deletedCount > 1 ? 's' : ''} exitosamente`,
                life: 4000
              });
            } else {
              this.$toast.add({
                severity: 'warn',
                summary: 'Eliminación parcial',
                detail: `${deletedCount} eliminados, ${errorCount} con errores`,
                life: 4000
              });
            }
          }

        }).catch(error => {
          console.error('Error al eliminar verificador:', error);
          errorCount++;
          
          // Mostrar mensaje cuando se complete el procesamiento de todos los elementos
          if (deletedCount + errorCount === totalItems) {
            if (deletedCount === 0) {
              this.$toast.add({
                severity: 'error',
                summary: 'Error al eliminar',
                detail: 'No se pudieron eliminar los verificadores seleccionados',
                life: 4000
              });
            } else {
              this.$toast.add({
                severity: 'warn',
                summary: 'Eliminación parcial',
                detail: `${deletedCount} eliminados, ${errorCount} con errores`,
                life: 4000
              });
            }
          }
        });
      });

    },

    getAllVerifiersByAdminId(adminId) {
      this.loading = true;
      console.log('Obteniendo verificadores para adminId:', adminId);

      this.verifierManagementApiServices.getAllByAdminId(adminId).then(response => {
        // Validar respuesta usando función modular
        this.validateServerResponse(response, 'verificadores');

        this.itemsArray = response.data.map(resource  => new Verifier(resource));

        // Parsear status de inglés a español
        this.itemsArray = this.itemsArray.map(verifier => {
          if (verifier.status === 'ACTIVE') {
            verifier.status = 'ACTIVO';
          } else if (verifier.status === 'INACTIVE') {
            verifier.status = 'INACTIVO';
          }
          return verifier;
        });

        console.log('Verificadores cargados:', this.itemsArray);
      }).catch(error => {
        this.itemsArray = []; // Limpiar datos en caso de error
        this.handleServerError(error, 'los verificadores');
      }).finally(() => {
        this.loading = false;
      });

    },


  },

  created() {
    const authStore = useAuthenticationStore();
    this.adminId = authStore.currentUserId; // Obtener el ID del usuario autenticado
    this.verifierManagementApiServices = new VerifierApiService('/verifiers');
    this.getAllVerifiersByAdminId(this.adminId); // Usar ID de admin simulado 1
  }

};

</script>

<template>
  <pv-toast />

  <div class="h-full overflow-hidden flex flex-column p-4">
    <!-- Header con título + descripción y resúmenes -->
    <div class="flex justify-content-between align-items-center mb-1">
      <!-- Título y descripción -->
      <div class="flex flex-column">
        <h2 class="text-3xl font-bold mb-2">Gestión de verificadores</h2>
        <p>Gestión de verificadores: contacto, credenciales y asignación de órdenes</p>
      </div>

      <!-- Resumen de cantidad de verificadores -->
      <div class="flex gap-3 flex-wrap">
        <!-- Total de verificadores -->
        <div class="flex align-items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 border-round border-1 border-blue-200">
          <i class="pi pi-users text-blue-600"></i>
          <span class="font-semibold text-sm">Total:</span>
          <span class="font-bold">{{ itemsArray.length }}</span>
        </div>

        <!-- Verificadores Activos -->
        <div class="flex align-items-center gap-2 bg-green-50 text-green-700 px-3 py-1 border-round border-1 border-green-200">
          <i class="pi pi-check-circle text-green-600"></i>
          <span class="font-semibold text-sm">Activos:</span>
          <span class="font-bold">{{ itemsArray.filter(v => v.status === 'ACTIVO').length }}</span>
        </div>

        <!-- Verificadores Inactivos -->
        <div class="flex align-items-center gap-2 bg-red-50 text-red-700 px-3 py-1 border-round border-1 border-red-200">
          <i class="pi pi-times-circle text-red-600"></i>
          <span class="font-semibold text-sm">Inactivos:</span>
          <span class="font-bold">{{ itemsArray.filter(v => v.status === 'INACTIVO').length }}</span>
        </div>
      </div>
    </div>

    <!-- Componente DataManager para gestionar verificadores -->

    <data-manager
        :items="itemsArray"
        :filtered-items="filteredItemsArray"
        :global-filter-value="globalFilterValue"
        :columns="columns"
        :title="title"
        :loading="loading"
        :dynamic="true"
        :show-new="true"
        :show-delete="true"
        :show-export="true"
        :show-selection="true"
        :show-actions="true"
        :show-action-buttons="true"
        :rows="10"
        :rows-per-page-options="[5, 10, 15, 20, 50]"
        new-button-label="Nuevo verificador"
        delete-button-label="Eliminar"
        export-button-label="Exportar"
        search-placeholder="Busca por nombre, apellido, email, teléfono..."
        @new-item-requested-manager="onNewItem"
        @delete-selected-items-requested-manager="onDeleteSelectedItems"
        @delete-item-requested-manager="onDeleteItem"
        @view-item-requested-manager="onViewItem"
        @global-filter-change="onGlobalFilterChange"
        @clear-filters="onClearFilters"
    >

      <!-- Filtro personalizado para el estado -->
      <template #filters="{ clearFilters }">
        <div class="flex align-items-center gap-2">
          <pv-dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="Estado: Todos"
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

      <!-- Columna Personalizada de estatus de verificador -->
      <template #status="{ data }">
        <pv-tag
            :value="data.status"
            :severity="getStatusItemsArray(data.status)"
            class="text-sm"
        />
      </template>


    </data-manager>

    <!-- Agregar nuevo verificador -->
    <verifier-create-and-edit
        :edit="isEdit"
        :item="currentItem"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested"
    />


  </div>
</template>



<style scoped>
/* Estilos usando variables CSS corporativas */
.text-orange-500 {
  color: var(--color-warning) !important;
}


/* Estilos específicos de PrimeVue que requieren :deep() para penetrar en los componentes */
/* Los estilos de botones ahora son globales en style.css */

/* Los estilos de input y dropdown ahora son globales en style.css */

/* Los estilos de tags y checkboxes ahora son globales en style.css */

/* Los estilos de botones de acción y paginador ahora son globales en style.css */
</style>