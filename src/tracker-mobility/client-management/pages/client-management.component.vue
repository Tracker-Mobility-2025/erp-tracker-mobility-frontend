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

      // Clientes filtrados y empleados filtrados
      filteredClients: [],
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
      // No necesitamos asignar filteredClients manualmente ya que es computed
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
        })
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
    <div class="flex justify-content-between align-items-center mb-4">
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

    

  </div>
</template>

<style scoped>
/* Estilos mínimos - usando principalmente PrimeFlex y PrimeVue */
</style>