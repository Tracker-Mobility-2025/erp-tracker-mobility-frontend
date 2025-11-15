<script>

import ClientCreateAndEdit from "../components/client-create-and-edit.component.vue";
import {ClientTrackerApiService} from "../services/client-tracker-api.service.js";
import {ClientTracker} from "../models/client-tracker-mobility.entity.js";
import {CreateClientTracker} from "../models/create-client-tracker-mobility.entity.js";


export default {
  name:'client-management',
  components: {ClientCreateAndEdit},

  data () {
    return {

      // Servicio de cliente
      clientTrackerApiService: new ClientTrackerApiService('/applicant-companies'),

      // Nuevo cliente
      createItem: new ClientTracker({}), // Nuevo

      // Cliente
      clientArray: [], // Array de clientes
      itemClient: null, // Cliente

      // Empleado del cliente
      employeeArray: [], // Array de empleados del cliente
      itemEmployee: null, // Empleado del cliente

      // Empleados filtrados
      filteredEmployees: [],

      // Contenido de la barra de búsqueda
      search: '',
      selectStatus: '',

      // Estado de carga
      loading: false,

      // Estados para crear, editar ver diálogo
      isEdit: false,
      submitted: false,
      createAndEditDialogIsVisible: false,

      // Opciones para el dropdown de estado
      statusOptions: [
        { label: 'Todos', value: '' },
        { label: 'Activo', value: 'ACTIVE' },
        { label: 'Inactivo', value: 'INACTIVE' }
      ],

      // Paginación
      currentPage: 0,
      pageSize: 6, // Mostrar 6 elementos por página
      totalRecords: 0,

    };
  },

  computed: {

    // Filtrar clientes según la búsqueda y el estado seleccionado
    filteredClients() {
      let filtered = this.clientArray;

      // Filtrar por texto de búsqueda
      // Solo aplicar filtro si hay contenido real (no null, no undefined, no string vacío o solo espacios)
      if (this.search && this.search.trim().length > 0) {
        // Normalizar el término de búsqueda: quitar espacios extra y convertir a minúsculas
        const searchLower = this.search.toLowerCase().trim().replace(/\s+/g, ' ');
        filtered = filtered.filter(client =>
          (client.ruc && client.ruc.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchLower)) ||
          (client.companyName && client.companyName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchLower)) ||
          (client.status && client.status.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchLower))
        );
      }

      // Filtrar por estado seleccionado
      if (this.selectStatus) {
        filtered = filtered.filter(client => client.status === this.selectStatus);
      }

      return filtered;
    },

    // Clientes paginados
    paginatedClients() {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredClients.slice(start, end);
    },

    // Total de registros para paginación
    totalFilteredRecords() {
      return this.filteredClients.length;
    },
  },


  methods: {

    // Retorna la cantidad de clientes por estado
    getCountByStatus(status) {
      return this.clientArray.filter(c => c.status === status).length;
    },

    // Retorna la clase CSS para el estado del cliente
    getStatusClass(status) {
      const statusMap = {
        'ACTIVE': 'status-active',
        'INACTIVE': 'status-inactive'
      };
      return statusMap[status] || 'status-default';
    },

    // E para crear, editar
    onNewItem() {
      console.log('Crear un nuevo cliente');

      this.createItem = new ClientTracker({});

      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onCancelRequested() {
      this.isEdit = false;
      this.submitted = false;
      this.itemClient = null;
      this.createAndEditDialogIsVisible = false;
    },


    onSaveRequested(item) {
      console.log('Guardar cliente:', item);
      this.submitted = true;
      
      if (this.isEdit) {
        this.update(item);
      } else {
        this.create(item);
      }
      
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
      this.itemClient = null;
    },


    onClearFilters() {
      this.search = '';
      this.selectStatus = '';
      this.currentPage = 0; // Resetear a la primera página
    },

    // Nuevos métodos para acciones de cliente
    onViewItem(item) {
      this.itemClient = new ClientTracker(item);
      console.log('Ver detalles del cliente:', item);
      // router para navegar a una página de detalles.
      this.$router.push({
        name: 'client-detail',
        query: { id: item.id }
      });

    },

    onEditItem(client) {
      this.itemClient = client;
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
      console.log('Editar cliente:', client);
    },

    onDeleteItem(client) {
      console.log('Eliminar cliente:', client);
      
      // Confirmar eliminación con el usuario
      this.$confirm.require({
        message: `¿Está seguro de eliminar el cliente ${client.companyName}?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.delete(client.id);
        },
        reject: () => {
          console.log('Eliminación cancelada');
        }
      });
    },

    // Manejar cambio de página
    onPageChange(event) {
      this.currentPage = event.page;
    },


    create(clientData) {
      this.loading = true;
      
      const newClient = new CreateClientTracker(clientData);

      console.log('Creando cliente:', newClient);

      this.clientTrackerApiService.create(newClient).then(response => {
        console.log('Cliente creado en backend:', response.data);
        // Agregar al array local
        this.clientArray.push(new ClientTracker(response.data));
        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Cliente creado',
          detail: `El cliente ${clientData.companyName} ha sido creado exitosamente`,
          life: 4000
        });

      }).catch(error => {
        console.error('Error al crear cliente en backend:', error);

        this.$toast.add({
          severity: 'error',
          summary: 'Error al crear',
          detail: 'No se pudo crear el cliente',
          life: 4000
        });
      }).finally(() => {
        this.loading = false;
      });
      

    },

    // Actualizar cliente
    update(clientData) {
      this.loading = true;
      
      console.log('Actualizando cliente:', clientData);

      this.clientTrackerApiService.update(clientData.id, clientData).then(response => {
        console.log('Cliente actualizado en backend:', response.data);

        // Actualizar en el array local
        const index = this.clientArray.findIndex(c => c.id === clientData.id);
        if (index !== -1) {
          this.clientArray.splice(index, 1, new ClientTracker(response.data));
        }

        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Cliente actualizado',
          detail: `El cliente ${clientData.companyName} ha sido actualizado exitosamente`,
          life: 4000
        });


      }).catch(error => {
        console.error('Error al actualizar cliente en backend:', error);

        this.$toast.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: 'No se pudo actualizar el cliente',
          life: 4000
        });

      }).finally(() => {
        this.loading = false;
      });



    },

    // Eliminar cliente
    delete(clientId) {
      this.loading = true;


      this.clientTrackerApiService.delete(clientId).then(response => {
        console.log('Cliente eliminado en backend:', response.data);

        // Eliminar del array local
        this.clientArray = this.clientArray.filter(c => c.id !== clientId);

        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Cliente eliminado',
          detail: `El cliente ha sido eliminado exitosamente`,
          life: 4000
        });

      }).catch(error => {
        console.error('Error al eliminar cliente en backend:', error);

        // Mostrar mensaje de error
        this.$toast.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: 'No se pudo eliminar el cliente',
          life: 4000
        });

      }).finally(() => {
        this.loading = false;
      });
      

    },

    // Retornar todo los clientes
    getAllClients() {

      this.loading = true;

      this.clientTrackerApiService.getAll().then(response => {

        // Asignar datos al array de clientes parseando a la entidad ClientTracker
        this.clientArray = response.data.map(clientData => new ClientTracker(clientData));

        console.log("Clients recuperados:", this.clientArray);


      }).catch(error => {
        console.error("Error fetching clients:", error);
        this.loading = false;
      }).finally(
        () => {
          this.loading = false;
        }
      )


    },



  },


  watch: {
    // Resetear página cuando cambian los filtros
    search() {
      this.currentPage = 0;
    },
    selectStatus() {
      this.currentPage = 0;
    }
  },

  created() {
    // Inicializar servicio de cliente
    //this.clientTrackerApiService = new ClientTrackerApiService('/clients');

    // Obtener todos los clientes al crear el componente
    this.getAllClients();

  },

}

</script>

<template>

  <!-- Dialogo de confirmación -->
  <pv-confirm-dialog/>
  <pv-toast/>


  <div class="h-full overflow-hidden flex flex-column p-4">
    <!-- Header con título + descripción -->
    <div class="flex justify-content-between align-items-center mb-1">
      <!-- Título y descripción -->
      <div class="flex flex-column">
        <h2 class="text-3xl font-bold mb-2">Gestión de Clientes</h2>
        <p>Administra la información y cuentas de tus clientes y su equipo</p>
      </div>
    </div>

    <!-- Card con barra de búsqueda, filtro por estado y botón para limpiar filtros -->
    <div class="surface-card p-4 border-round shadow-2 mb-4">
      <div class="flex flex-column md:flex-row gap-3 align-items-stretch md:align-items-center">
        <!-- Barra de búsqueda -->
        <pv-icon-field class="flex-grow-1">
          <pv-input-icon class="pi pi-search" />
          <pv-input-text
              v-model="search"
              placeholder="Buscar por RUC, nombre de empresa o estado..."
              class="w-full h-full"
          />
        </pv-icon-field>

        <!-- Filtro por estado -->
        <div class="w-full md:w-auto" style="min-width: 200px">
          <pv-select
            v-model="selectStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filtrar por estado"
            class="w-full"
          >
            <template #option="slotProps">
              <div class="flex align-items-center justify-content-between w-full">
                <span>{{ slotProps.option.label }}</span>
                <span 
                  v-if="slotProps.option.value !== ''"
                  class="badge-custom ml-2"
                  :class="getStatusClass(slotProps.option.value)"
                >
                  {{ getCountByStatus(slotProps.option.value) }}
                </span>
                <span 
                  v-else
                  class="badge-custom ml-2 status-default"
                >
                  {{ clientArray.length }}
                </span>
              </div>
            </template>
          </pv-select>
        </div>

        <!-- Botón para limpiar filtros -->
        <div class="w-full md:w-auto">
          <pv-button
            label="Limpiar Filtros"
            icon="pi pi-filter-slash"
            severity="secondary"
            outlined
            @click="onClearFilters"
            class="w-full md:w-auto"
          />
        </div>

        <!-- Botón de agregar nuevo cliente -->
        <div class="w-full md:w-auto">
          <pv-button
            label="Agregar Cliente"
            icon="pi pi-plus"
            severity="success"
            size="medium"
            @click="onNewItem"
            class="w-full md:w-auto"
          />
        </div>
      </div>
    </div>

    <!-- Tarjetas de clientes -->
    <div class="flex-grow-1 flex flex-column" style="min-height: 0;">
      <div class="grid overflow-auto flex-grow-1" style="min-height: 0;">
        <div 
          v-for="client in paginatedClients" 
          :key="client.ruc"
          class="col-12 sm:col-6 lg:col-4 xl:col-4"
        >
          <div class="surface-card p-4 border-round shadow-2 h-full">
            <!-- Header de la tarjeta con estado -->
            <div class="flex justify-content-between align-items-start mb-3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-building text-primary text-xl"></i>
                <span 
                  class="status-tag px-2 py-1 border-round text-xs font-semibold"
                  :class="getStatusClass(client.status)"
                >
                  {{ client.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>

            <!-- Información del cliente -->
            <div class="mb-4">
              <h4 class="text-lg font-bold text-900 mb-2 line-height-3">{{ client.companyName }}</h4>
              <div class="flex flex-column gap-2">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-id-card text-500"></i>
                  <span class="text-600 text-sm font-medium">RUC:</span>
                  <span class="text-900 font-semibold">{{ client.ruc }}</span>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-2">
              <pv-button
                icon="pi pi-eye"
                severity="info"
                outlined
                size="small"
                @click="onViewItem(client)"
                v-tooltip="'Ver detalles'"
                class="flex-1"
              />
              <pv-button
                icon="pi pi-pencil"
                severity="warning"
                outlined
                size="small"
                @click="onEditItem(client)"
                v-tooltip="'Editar cliente'"
                class="flex-1"
              />
              <pv-button
                icon="pi pi-trash"
                severity="danger"
                outlined
                size="small"
                @click="onDeleteItem(client)"
                v-tooltip="'Eliminar cliente'"
                class="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Paginador -->
      <div v-if="totalFilteredRecords > 0" class="mt-3 flex-shrink-0">
        <pv-paginator
          :first="currentPage * pageSize"
          :rows="pageSize"
          :totalRecords="totalFilteredRecords"
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        />
      </div>
    </div>

    <!-- Mensaje cuando no hay clientes -->
    <div v-if="clientArray.length === 0" class="flex-grow-1 flex align-items-center justify-content-center">
      <div class="text-center">
        <i class="pi pi-inbox text-6xl text-400 mb-3 block"></i>
        <h3 class="text-900 mb-2">No hay clientes registrados</h3>
        <p class="text-600 mb-4">Comienza agregando tu primer cliente</p>
        <pv-button
          label="Agregar Primer Cliente"
          icon="pi pi-plus"
          severity="success"
          @click="onNewItem"
        />
      </div>
    </div>

    <!-- Mensaje cuando los filtros no devuelven resultados -->
    <div v-else-if="filteredClients.length === 0 && (search || selectStatus)" class="flex-grow-1 flex align-items-center justify-content-center">
      <div class="text-center">
        <i class="pi pi-search text-6xl text-400 mb-3 block"></i>
        <h3 class="text-900 mb-2">No se encontraron clientes</h3>
        <p class="text-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
        <pv-button
          label="Limpiar Filtros"
          icon="pi pi-filter-slash"
          severity="secondary"
          @click="onClearFilters"
        />
      </div>
    </div>

    <!-- Diálogo para crear/editar cliente -->
    <client-create-and-edit
        :edit="isEdit"
        :item="itemClient"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested"
    />

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
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

/* Usando PrimeFlex pero controlando el estiramiento */
.grid {
  justify-content: flex-start;
}

/* Asegurar que las cards no se estiren horizontalmente */
.grid > div[class*="col-"] {
  max-width: 400px;
  min-width: 300px;
}

/* En desktop (xl y lg): limitar a 3 columnas con ancho fijo */
@media (min-width: 992px) {
  .grid > div.col-12.sm\:col-6.lg\:col-4.xl\:col-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

/* En tablet (sm y md): limitar a 2 columnas */
@media (min-width: 576px) and (max-width: 991px) {
  .grid > div.col-12.sm\:col-6.lg\:col-4.xl\:col-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* En móvil: 1 columna completa */
@media (max-width: 575px) {
  .grid > div.col-12.sm\:col-6.lg\:col-4.xl\:col-4 {
    flex: 0 0 100%;
    max-width: 100%;
    min-width: auto;
  }
}

/* Asegurar que las cards mantengan altura natural */
.surface-card {
  height: fit-content !important;
}
</style>