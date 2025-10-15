<script>

import {ClientTracker} from "../models/client-tracker-mobility.entity.js";
import {ClientTrackerApiService} from "../services/client-tracker-api.service.js";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {EmployeeClientTrackerApiService} from "../services/employee-client-tracker-api.service.js";
import {EmployeeClientTracker} from "../models/employees-client.entity.js";
import {CreateEmployeeClient} from "../models/create-employees-client.entity.js";
import EmployeeCollaboratorCreateAndEdit from "../components/employee-collaborator-create-and-edit.vue";

export default {
  name: "client-details-management",
  components: {DataManager, EmployeeCollaboratorCreateAndEdit},

  data() {
    return {

      clientId: null, // ID del cliente obtenido de los query parameters
      item: null, // Cliente actual
      employeeArray: [], // Array de colaboradores del cliente

      // Servicio para el cliente
      clientTrackerApiService: new ClientTrackerApiService('/applicant-companies'),

      // Servicio para los colaboradores (empleados) del cliente
      employeeClientTrackerApiService: new EmployeeClientTrackerApiService('/company-employees'),

      columns: [
        { field: 'name', header: 'Nombres', sortable: true, style: 'width: 160px;' },
        { field: 'lastName', header: 'Apellidos', sortable: true, style: 'width: 160px;' },
        { field: 'email', header: 'Email', sortable: true, style: 'width: 200px;' },
        { field: 'phoneNumber', header: 'Teléfono', sortable: true, style: 'width: 140px;' },
        { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
      ],

      statusOptions: [      // Opciones de estado para el filtro
        { label: 'Todos', value: null },
        { label: 'Activo', value: 'ACTIVE' },
        { label: 'Inactivo', value: 'INACTIVE' },
      ],




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
      itemEmployee: null, // Empleado seleccionado para edición

    };
  },

  computed: {

    filteredItemsArray() {
      let filtered = [...this.employeeArray];

      // Filtro por búsqueda global (nombre, apellido, email, teléfono)
      // Solo aplicar filtro si hay contenido real (no null, no undefined, no string vacío o solo espacios)
      if (this.globalFilterValue && this.globalFilterValue.trim().length > 0) {
        // Normalizar el término de búsqueda: quitar espacios extra y convertir a minúsculas
        const searchTerm = this.globalFilterValue.toLowerCase().trim().replace(/\s+/g, ' ');
        filtered = filtered.filter(employee =>
          (employee.name && employee.name.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (employee.lastName && employee.lastName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (employee.email && employee.email.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm)) ||
          (employee.phoneNumber && employee.phoneNumber.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm))
        );
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(employee => employee.status === this.selectedStatus);
      }

      return filtered;
    },


    statusProps() {
      if (this.item?.status === 'ACTIVE') {
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
      console.log('Crear nuevo colaborador');
      this.itemEmployee = null;
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteSelectedItems(selectedItems) {
      if (!selectedItems || selectedItems.length === 0) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No hay items seleccionados para eliminar',
          life: 3000
        });
        return;
      }

      // Obtener los nombres de los colaboradores seleccionados para mostrar en la confirmación
      const selectedItemNames = this.employeeArray
        .filter(employee => selectedItems.includes(employee.id))
        .map(employee => `${employee.name} ${employee.lastName}`)
        .join(', ');

      // Confirmar eliminación múltiple
      this.$confirm.require({
        message: `¿Está seguro de eliminar los siguientes ${selectedItems.length} colaborador(es): ${selectedItemNames}?`,
        header: 'Confirmar eliminación múltiple',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar Todos',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.deleteMultipleItems(selectedItems);
        },
        reject: () => {
          console.log('Eliminación múltiple cancelada');
        }
      });
    },

    onDeleteItem(item) {
      console.log('Eliminar colaborador:', item);
      
      // Confirmar eliminación con el usuario
      this.$confirm.require({
        message: `¿Está seguro de eliminar al colaborador ${item.name} ${item.lastName}?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.delete(item.id);
        },
        reject: () => {
          console.log('Eliminación cancelada');
        }
      });
    },

    onViewItem(item) {
      // Lógica para manejar la visualización de un ítem específico
      console.log('Ver ítem:', item);
    },

    onEditItem(item) {
      console.log('Editar colaborador:', item);
      this.itemEmployee = new EmployeeClientTracker(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    onClearFilters() {
      this.selectedStatus = null;
      this.globalFilterValue = '';
    },

    getStatusItemsArray(status) {
      switch (status) {
        case 'ACTIVE':
          return 'success';
        case 'INACTIVE':
          return 'danger';
        default:
          return 'info';
      }
    },

    onCancelRequested() {
      this.isEdit = false;
      this.submitted = false;
      this.itemEmployee = null;
      this.createAndEditDialogIsVisible = false;
    },

    onSaveRequested(employeeData) {
      console.log('Guardar colaborador:', employeeData);
      this.submitted = true;
      
      if (this.isEdit) {
        this.update(employeeData);
      } else {
        this.create(employeeData);
      }
      
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
      this.itemEmployee = null;
    },

    // Crear nuevo empleado
    create(employeeData) {
      this.loading = true;
      
      console.log('Creando colaborador:', employeeData);

      let newEmployee = new CreateEmployeeClient(employeeData);

      this.employeeClientTrackerApiService.create(newEmployee).then(response => {
        console.log('Colaborador creado en backend:', response.data);
        // Agregar al array local
        this.employeeArray.push(new EmployeeClientTracker(response.data));
        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Colaborador creado',
          detail: `El colaborador ${employeeData.name} ${employeeData.lastName} ha sido creado exitosamente`,
          life: 4000
        });
      }).catch(error => {
        console.error('Error al crear colaborador en backend:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error al crear',
          detail: 'No se pudo crear el colaborador',
          life: 4000
        });
      }).finally(() => {
        this.loading = false;
      });
    },

    // Actualizar empleado
    update(employeeData) {
      this.loading = true;
      
      console.log('Actualizando colaborador:', employeeData);

      this.employeeClientTrackerApiService.update(employeeData.id, employeeData).then(response => {
        console.log('Colaborador actualizado en backend:', response.data);
        
        // Actualizar en el array local
        const index = this.employeeArray.findIndex(emp => emp.id === employeeData.id);
        if (index !== -1) {
          this.employeeArray.splice(index, 1, new EmployeeClientTracker(response.data));
        }
        
        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Colaborador actualizado',
          detail: `El colaborador ${employeeData.name} ${employeeData.lastName} ha sido actualizado exitosamente`,
          life: 4000
        });
      }).catch(error => {
        console.error('Error al actualizar colaborador en backend:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: 'No se pudo actualizar el colaborador',
          life: 4000
        });
      }).finally(() => {
        this.loading = false;
      });
    },

    // Eliminar empleado
    delete(employeeId) {
      this.loading = true;

      console.log('Eliminando colaborador con ID:', employeeId);

      this.employeeClientTrackerApiService.delete(employeeId).then(response => {
        console.log('Colaborador eliminado en backend:', response.data);
        
        // Eliminar del array local
        this.employeeArray = this.employeeArray.filter(emp => emp.id !== employeeId);
        
        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Colaborador eliminado',
          detail: 'El colaborador ha sido eliminado exitosamente',
          life: 4000
        });
        
        // Cerrar el diálogo de confirmación
        this.$confirm.close();
      }).catch(error => {
        console.error('Error al eliminar colaborador en backend:', error);
        
        // Mostrar mensaje de error
        this.$toast.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: 'No se pudo eliminar el colaborador',
          life: 4000
        });
        
        // Cerrar el diálogo de confirmación
        this.$confirm.close();
      }).finally(() => {
        this.loading = false;
      });
    },

    // Eliminar múltiples items (colaboradores)
    async deleteMultipleItems(selectedItemIds) {
      this.loading = true;
      
      try {
        const deletePromises = selectedItemIds.map(itemId => 
          this.employeeClientTrackerApiService.delete(itemId)
        );

        const results = await Promise.allSettled(deletePromises);
        
        let successCount = 0;
        let errorCount = 0;
        
        results.forEach((result, index) => {
          const itemId = selectedItemIds[index];
          
          if (result.status === 'fulfilled') {
            // Eliminar del array local
            this.employeeArray = this.employeeArray.filter(emp => emp.id !== itemId);
            successCount++;
          } else {
            console.error(`Error eliminando colaborador ${itemId}:`, result.reason);
            errorCount++;
          }
        });

        // Mostrar mensaje según los resultados
        if (successCount > 0 && errorCount === 0) {
          this.$toast.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `${successCount} colaborador(es) eliminado(s) exitosamente`,
            life: 4000
          });
        } else if (successCount > 0 && errorCount > 0) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Eliminación parcial',
            detail: `${successCount} colaborador(es) eliminado(s), ${errorCount} falló(s)`,
            life: 4000
          });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error en eliminación',
            detail: `No se pudo eliminar ningún colaborador`,
            life: 4000
          });
        }

      } catch (error) {
        console.error('Error en eliminación múltiple:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error inesperado durante la eliminación múltiple',
          life: 4000
        });
      } finally {
        this.loading = false;
        // Cerrar el diálogo de confirmación
        this.$confirm.close();
      }
    },

    getEmployeesByClientId() {
      // Lógica para obtener los colaboradores asociados al cliente por ID
      console.log('Obtener colaboradores del cliente por ID:', this.clientId);

      const employeeClientTrackerApiServiceTmp = new EmployeeClientTrackerApiService('/company-employees/applicant-company');

      employeeClientTrackerApiServiceTmp.getAllByClient(this.clientId).then(response => {
        this.employeeArray = response.data.map(item => (new EmployeeClientTracker(item)));

        console.log('Colaboradores obtenidos:', this.employeeArray);
      }).catch(error => {
        console.error('Error al obtener los colaboradores del cliente:', error);
      })
    },

    getClientById() {

      this.loading = true;

      this.clientTrackerApiService.getById(this.clientId).then(response => {
        this.item = new ClientTracker(response.data);
      }).catch(error => {
        console.error('Error al obtener el cliente por ID:', error);
      }).finally(() => {
        this.loading = false;
        this.getEmployeesByClientId();
      });

    },

  },


  created() {
    // Obtener el ID del cliente desde los query parameters
    this.clientId = this.$route.query.id;
    if (this.clientId) {
      this.getClientById();
    }
  },


};

</script>

<template>
  <!-- Dialogo de confirmación -->


  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Header Breadcrumb + Status -->
    <div class="flex justify-content-between align-items-center pb-1">

      <!-- Título y descripción -->
      <div class="flex flex-column pb-1" >
        <h2 class="text-3xl font-bold mb-2">Gestión de colaboradores del cliente</h2>
        <p v-if="item">
          <span class="font-bold text-primary-local ">{{ item.executiveName }}: </span> 
          Contacto y credenciales de colaboradores
        </p>
        <p v-else>Cargando información del cliente...</p>
      </div>

      <!-- Estado del cliente-->
      <div 
        v-if="item" 
        :class="['flex align-items-center gap-2 px-3 py-1 border-round border-1', statusProps.container]"
      >
        <i :class="statusProps.icon"></i>
        <span class="font-semibold text-sm">Estado del cliente:</span>

        <span class="font-bold"> {{ item.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }} </span>
      </div>

    </div>




    <data-manager
        :items="employeeArray"
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
        :show-view-action="false"
        :show-edit-action="true"
        :show-delete-action="true"
        :rows="10"
        :rows-per-page-options="[5, 10, 15, 20, 50]"
        new-button-label="Nuevo colaborador"
        delete-button-label="Eliminar"
        export-button-label="Exportar"
        edit-button-label="Editar"
        delete-action-label="Eliminar"
        search-placeholder="Busca por nombre, apellido, email, teléfono..."
        @new-item-requested-manager="onNewItem"
        @delete-selected-items-requested-manager="onDeleteSelectedItems"
        @delete-item-requested-manager="onDeleteItem"
        @edit-item-requested-manager="onEditItem"
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

      <!-- Columna Personalizada de estatus de colaborador -->
      <template #status="{ data }">
        <pv-tag
            :value="data.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'"
            :severity="getStatusItemsArray(data.status)"
            class="text-sm"
        />
      </template>
    </data-manager>

    <!-- Diálogo para crear/editar colaborador -->
    <employee-collaborator-create-and-edit
        :edit="isEdit"
        :item="itemEmployee"
        :visible="createAndEditDialogIsVisible"
        :client-id="clientId"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested"
    />

  </div>

</template>

<style scoped>

</style>