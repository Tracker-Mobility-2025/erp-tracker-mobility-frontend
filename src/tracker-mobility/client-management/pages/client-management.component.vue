<script>

import ModuleUnderDevelopment from "../../../public/components/module-under-development.component.vue";
import {ClientTrackerApiService} from "../services/client-tracker-api.service.js";
import {ClientTracker} from "../models/client-tracker-mobility.entity.js";

export default {
  name:'client-management',
  components: {ModuleUnderDevelopment},

  data () {
    return {

      // Servicio de cliente
      clientTrackerApiService: new ClientTrackerApiService('/clients'),

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
      createAndEditDialogIsVisible: true,

      // Opciones para el dropdown de estado
      statusOptions: [
        { label: 'Todos los estados', value: '' },
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
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        filtered = filtered.filter(client =>
          client.RUC.toLowerCase().includes(searchLower) ||
          client.companyName.toLowerCase().includes(searchLower) ||
          client.status.toLowerCase().includes(searchLower)
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

    // ver detalles del cliente
    onViewItem() {
      return this.itemClient !== null && !this.isEdit;
    },

    // E para crear, editar
    onNewItem() {
      console.log('Crear un nuevo cliente');

      this.createItem = new ClientTracker({});

      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;    },

    onEditItem() {
      return this.itemClient !== null;
    },

    onDeleteItem() {
      return this.itemClient !== null;
    },

    onCancelRequested() {
      this.isEdit = false;
      this.submitted = false;
      this.itemClient = null;
      this.createAndEditDialogIsVisible = false;
    },


    onSaveRequested(item){

    },


    onClearFilters() {
      this.search = '';
      this.selectStatus = '';
      this.currentPage = 0; // Resetear a la primera página
    },

    // Nuevos métodos para acciones de cliente
    onViewClient(client) {
      this.itemClient = client;
      console.log('Ver detalles del cliente:', client);
      // Aquí puedes implementar la lógica para mostrar detalles
    },

    onEditClient(client) {
      this.itemClient = client;
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
      console.log('Editar cliente:', client);
    },

    onDeleteClient(client) {
      this.itemClient = client;
      console.log('Eliminar cliente:', client);
      // Aquí puedes implementar la lógica de confirmación y eliminación
    },

    // Manejar cambio de página
    onPageChange(event) {
      this.currentPage = event.page;
    },


    create(){

      this.clientTrackerApiService.create(this.createItem).then(response => {


      }).catch(error => {
        console.error("Error creating client:", error);
      });


    },

    update(){

    this.clientTrackerApiService.update(this.itemClient.id, this.itemClient).then(response => {


      }).catch(error => {
        console.error("Error updating client:", error);
      });

    },


    // Retornar todo los clientes
    getAllClients() {

      // Data mockeada

      this.clientArray = [
        new ClientTracker({
          id: 1,
          RUC: '12345678901',
          companyName: 'Empresa A',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 2,
          RUC: '10987654321',
          companyName: 'Empresa B',
          role: 'CLIENTE',
          status: 'INACTIVE'
        }),
        new ClientTracker({
          id: 3,
          RUC: '11223344556',
          companyName: 'Empresa C',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 4,
          RUC: '20123456789',
          companyName: 'Constructora Andina SAC',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 5,
          RUC: '20567891234',
          companyName: 'Servicios Logísticos del Sur',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 6,
          RUC: '20456789123',
          companyName: 'Agroexportadora Pacífico',
          role: 'CLIENTE',
          status: 'INACTIVE'
        }),
        new ClientTracker({
          id: 7,
          RUC: '20654321987',
          companyName: 'Consultora Global Solutions',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 8,
          RUC: '20765432198',
          companyName: 'Inversiones Rivera EIRL',
          role: 'CLIENTE',
          status: 'INACTIVE'
        }),
        new ClientTracker({
          id: 9,
          RUC: '20876543219',
          companyName: 'Tecnologías Innovadoras SAC',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 10,
          RUC: '20987654321',
          companyName: 'Transportes del Norte',
          role: 'CLIENTE',
          status: 'INACTIVE'
        }),
        new ClientTracker({
          id: 11,
          RUC: '21098765432',
          companyName: 'Servicios Financieros Lima',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 12,
          RUC: '21109876543',
          companyName: 'Comercializadora Andina',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 13,
          RUC: '21210987654',
          companyName: 'Logística Integral SAC',
          role: 'CLIENTE',
          status: 'INACTIVE'
        }),
        new ClientTracker({
          id: 14,
          RUC: '21321098765',
          companyName: 'Constructora del Pacífico',
          role: 'CLIENTE',
          status: 'ACTIVE'
        }),
        new ClientTracker({
          id: 15,
          RUC: '21432109876',
          companyName: 'Agroindustria Los Andes',
          role: 'CLIENTE',
          status: 'INACTIVE'
        }),
      ];

      /*
      this.loading = true;

      this.clientTrackerApiService.getAll().then(response => {

        this.clientArray = response.data.map(clientData => new ClientTrackerApiService(clientData));

        this.loading = false;

      }).catch(error => {
        console.error("Error fetching clients:", error);
        this.loading = false;
      });
      */


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
  <div class="h-full overflow-hidden flex flex-column p-4">
    <!-- Header con título + descripción y resúmenes -->
    <div class="flex justify-content-between align-items-center mb-1">
      <!-- Título y descripción -->
      <div class="flex flex-column">
        <h2 class="text-3xl font-bold mb-2">Gestión de Clientes</h2>
        <p>Administra la información y cuentas de tus clientes y su equipo</p>
      </div>

      <!-- Resumen de cantidad de clientes, clientes activos y clientes inactivos -->
      <div class="flex gap-3 flex-wrap">
        <!-- Total de Clientes -->
        <div class="flex align-items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 border-round border-1 border-blue-200">
          <i class="pi pi-users text-blue-600"></i>
          <span class="font-semibold text-sm">Total:</span>
          <span class="font-bold">{{ clientArray.length }}</span>
        </div>

        <!-- Clientes Activos -->
        <div class="flex align-items-center gap-2 bg-green-50 text-green-700 px-3 py-1 border-round border-1 border-green-200">
          <i class="pi pi-check-circle text-green-600"></i>
          <span class="font-semibold text-sm">Activos:</span>
          <span class="font-bold">{{ clientArray.filter(c => c.status === 'ACTIVE').length }}</span>
        </div>

        <!-- Clientes Inactivos -->
        <div class="flex align-items-center gap-2 bg-red-50 text-red-700 px-3 py-1 border-round border-1 border-red-200">
          <i class="pi pi-times-circle text-red-600"></i>
          <span class="font-semibold text-sm">Inactivos:</span>
          <span class="font-bold">{{ clientArray.filter(c => c.status === 'INACTIVE').length }}</span>
        </div>
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
          <pv-dropdown
            v-model="selectStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filtrar por estado"
            class="w-full"
          />
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
          :key="client.id"
          class="col-12 sm:col-6 lg:col-4 xl:col-4"
        >
          <div class="surface-card p-4 border-round shadow-2 h-full">
            <!-- Header de la tarjeta con estado -->
            <div class="flex justify-content-between align-items-start mb-3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-building text-primary text-xl"></i>
                <span 
                  :class="{
                    'bg-green-100 text-green-800': client.status === 'ACTIVE',
                    'bg-red-100 text-red-800': client.status === 'INACTIVE'
                  }"
                  class="px-2 py-1 border-round text-xs font-semibold"
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
                  <span class="text-900 font-semibold">{{ client.RUC }}</span>
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
                @click="onViewClient(client)"
                v-tooltip="'Ver detalles'"
                class="flex-1"
              />
              <pv-button
                icon="pi pi-pencil"
                severity="warning"
                outlined
                size="small"
                @click="onEditClient(client)"
                v-tooltip="'Editar cliente'"
                class="flex-1"
              />
              <pv-button
                icon="pi pi-trash"
                severity="danger"
                outlined
                size="small"
                @click="onDeleteClient(client)"
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

  </div>
</template>

<style scoped>
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