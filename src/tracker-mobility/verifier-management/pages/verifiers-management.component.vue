<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import VerifierCreateAndEdit from "../components/verifier-create-and-edit.component.vue";
import {Verifier} from "../models/verifiers.entity.js";
import {VerifierApiService} from "../services/verifier-api.service.js";
import {CreateVerifier} from "../models/create-verifier.entity.js";

export default {
  name: 'verifiers-management',
  components: {VerifierCreateAndEdit, DataManager},

  data() {
    return {

      adminId: null, // ID del administrador actual (simulado)
      createItem: new CreateVerifier({}), // Nuevo verificador a crear
      item: null, // Verificador actual para edición o creación

      // Servicio de verificador
      verifierApiServices: null,

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
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' },
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
      if (this.globalFilterValue) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
        filtered = filtered.filter(verifier =>
          verifier.name.toLowerCase().includes(searchTerm) ||
          verifier.lastname.toLowerCase().includes(searchTerm) ||
          verifier.email.toLowerCase().includes(searchTerm) ||
          verifier.phone.toLowerCase().includes(searchTerm)
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
      // Implementar lógica de eliminación individual
      const index = this.itemsArray.findIndex(order => order.id === item.id);
      if (index > -1) {
        this.itemsArray.splice(index, 1);
      }
    },

    onViewItem(item) {
      console.log('Ver detalles de orden:', item);

      this.$router.push({
        name: 'verifier-details',
        query: { id: item.id }
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
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    getStatusItemsArray(status) {
      switch (status) {
        case 'Activo':
          return 'success';
        case 'Inactivo':
          return 'danger';
        default:
          return 'info';
      }
    },

    onEditItem(item) {
      console.log('Editar orden:', item);
      // Implementar navegación a formulario de edición
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

      this.verifierApiServices.create(this.createItem).then(response => {

        let newItem = new Verifier(response.data);

        this.itemsArray.push(newItem);

        console.log('Verificador creado:', response.data);

        // this.notifySuccessfulAction('Campaign created successfully'); TODO

      }).catch(error => {
        console.error('Error al crear verificador:', error);
      });

    },

    deleteSelectedItems(){

      this.selectedItems.forEach((variable) => {
        this.verifierApiServices.delete(variable.id).then(response => {

          this.itemsArray = this.itemsArray.filter(item => item.id !== variable.id);

        }).catch(error => {
          console.error('Error al eliminar verificador:', error);
        });
      });

      // this.notifySuccessfulAction('Verificador eliminado con éxito'); TODO

    },


    getAllVerifiersByAdminId(adminId) {
      this.loading = true;
      console.log('Obteniendo verificadores para adminId:', adminId);

      this.verifierApiServices.getAllByAdminId(adminId).then(response => {
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



        this.loading = false;
      }).catch(error => {
        console.error('Error al obtener verificadores:', error);
        this.loading = false;
      });

    },


  },

  created() {
    this.adminId = 1; // Simular ID de admin
    this.verifierApiServices = new VerifierApiService('/verifiers');
    this.getAllVerifiersByAdminId(this.adminId); // Usar ID de admin simulado 1
  }

};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-2xl font-bold mb-2">Gestión de verificadores</h2>
    <p> Gestiona los perfiles de verificadores, incluyendo información de contacto, credenciales de acceso y
      asignación de ordenes de servicio </p>

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
        @edit-item-requested-manager="onEditItem"
        @view-item-requested-manager="onViewItem"
        @row-select="onRowSelect"
        @row-unselect="onRowUnselect"
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