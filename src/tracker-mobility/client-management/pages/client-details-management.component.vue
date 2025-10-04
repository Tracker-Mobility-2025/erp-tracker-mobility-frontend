<script>

import {ClientTracker} from "../models/client-tracker-mobility.entity.js";
import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: "client-details-management",
  components: {DataManager},

  props: {
    item: {
      type: ClientTracker,
      required: true
    }
  },

  data() {
    return {

      clientId: null,

      columns: [
        { field: 'firstName', header: 'Nombres', sortable: true, filter: true, style: 'min-width: 12rem' },
        { field: 'lastName', header: 'Apellidos', sortable: true, filter: true, style: 'min-width: 12rem' },
        { field: 'email', header: 'Email', sortable: true, filter: true, style: 'min-width: 14rem' },
        { field: 'phoneNumber', header: 'Teléfono', sortable: true, filter: true, style: 'min-width: 10rem' },
        { field: 'status', header: 'Estado', sortable: true, filter: true, style: 'min-width: 8rem' },
      ],

      statusOptions: [      // Opciones de estado para el filtro
        { label: 'Todos', value: null },
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' },
      ],


      collaboratorArray: [],

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedStatus: null, // Estado seleccionado en el filtro


      title: {
        singular: 'Colaborador',
        plural: 'Colaboradores',
      },

      loading: false,


      // Control para el diálogo de creación/edición
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,




    };
  },

  computed: {

    filteredItemsArray () {
      let filtered = [...this.collaboratorArray];
      if (this.selectedStatus) {
        filtered = filtered.filter(item => item.status === this.selectedStatus);
      }
      return filtered;
    },




    statusProps() {
      if (this.item.status === 'ACTIVO') {
        return {
          container: 'bg-green-50 text-green-700 border-green-200',
          icon: 'pi pi-check-circle text-green-600'
        };
      } else {
        return {
          container: 'bg-red-50 text-red-700 border-red-200',
          icon: 'pi pi-times-circle text-red-600'
        };
      }
    }
  },

  methods: {
    // Aquí puedes agregar métodos si es necesario
    onNewItem() {
      // Lógica para manejar la creación de un nuevo ítem
      console.log('Nuevo ítem solicitado');
    },

    onDeleteSelectedItems(selectedItems) {
      // Lógica para manejar la eliminación de ítems seleccionados
      console.log('Eliminar ítems seleccionados:', selectedItems);
    },

    onDeleteItem(item) {
      // Lógica para manejar la eliminación de un ítem específico
      console.log('Eliminar ítem:', item);
    },

    onViewItem(item) {
      // Lógica para manejar la visualización de un ítem específico
      console.log('Ver ítem:', item);
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    onClearFilters() {
      this.selectedStatus = null;
      this.globalFilterValue = '';
    },


    getClientById() {
      // Lógica para obtener los detalles del cliente por ID
      console.log('Obtener detalles del cliente por ID:', this.clientId);
    },

    getCollaboratorsByClientId() {
      // Lógica para obtener los colaboradores asociados al cliente por ID
      console.log('Obtener colaboradores del cliente por ID:', this.clientId);
    },

  },


  created() {

  },


};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Header Breadcrumb + Status -->
    <div class="flex justify-content-between align-items-center pb-1">

      <!-- Título y descripción -->
      <div class="flex flex-column pb-1" >
        <h2 class="text-3xl font-bold mb-2">Gestión de colaboradores del cliente</h2>
        <p><span class="font-bold text-primary-local ">{{ item.executiveName }}: </span> Contacto y credenciales de
          colaboradores</p>
      </div>


      <!-- Estado del cliente-->
      <div :class="['flex align-items-center gap-2 px-3 py-1 border-round border-1', statusProps.container]">
        <i :class="statusProps.icon"></i>
        <span class="font-semibold text-sm">Estado del cliente:</span>
        <span class="font-bold">{{ item.status.toLowerCase() }}</span>
      </div>

    </div>




    <data-manager
        :items="collaboratorArray"
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
        new-button-label="Nuevo colaborador"
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

    </data-manager>

  </div>








</template>

<style scoped>

</style>