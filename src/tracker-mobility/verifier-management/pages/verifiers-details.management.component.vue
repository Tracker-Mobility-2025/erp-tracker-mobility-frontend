<script>

export default {
  name: 'verifiers-details-management',

  props: {
    item: {
      type: Object,
      required: false,
      default : () => ({
        id: null,
        name: '',
        lastname: '',
        phone: '',
        status: 'Activo',
        email: '',
        password: '',
        agenda:'',
        assignedOrders: [],
      })
    },
  },


  data() {
    return {
      verifier: {},
    }
  },

  methods: {

    // Guardar cambios en el verificador
    onSaveVerifier() {
      // Lógica de implementación para guardar cambios

    },

    // Eliminar verificador
    onDeleteVerifier() {
      // Lógica de implementación para eliminar verificador


    },

    // Editar verificador
    onEditVerifier() {
      // Lógica de implementación para editar verificador

    },

    // Cancelar edición
    OnCancelEdit() {
      // Lógica de implementación para cancelar edición

    },
  },

}

</script>

<template>


  <div class="flex flex-column pb-4 gap-4">

  <!-- ====================== Card -> Datos del verificador ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary">Datos del verificador:</h3>

        <div class="formgrid grid">
          <!-- Fila 1 -->
          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary">Nombres</label>
            <p class="font-semibold text-dark m-0">Janover Gonzalo</p>
          </div>
          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary">Apellidos</label>
            <p class="font-semibold text-dark m-0">Saldaña Vela</p>
          </div>
          <div class="field col-12 md:col-3">
            <label class="font-semibold text-color-secondary">Número de contacto</label>
            <p class="font-semibold text-dark m-0">999 888 777</p>
          </div>
          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary">Cuenta</label>
            <p class="font-semibold text-dark m-0">Activo</p>
          </div>
          <div class="field col-12 md:col-3">
            <label class="font-semibold text-color-secondary">Cant. órdenes</label>
            <p class="font-semibold text-dark m-0">2</p>
          </div>

          <!-- Fila 2 -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary">Correo</label>
            <p class="font-semibold text-dark m-0">janover.saldana@trackermobility.com</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary">Contraseña</label>
            <p class="font-semibold text-dark m-0">ContraseñaSegura123</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary">Agenda</label>
            <p class="font-semibold text-dark m-0">Lunes a Viernes</p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-content-center gap-3 mt-3">
          <pv-button
              label="Editar"
              icon="pi pi-pencil"
              class="p-button-warning p-button-rounded px-4"
          />
          <pv-button
              label="Guardar"
              icon="pi pi-save"
              class="p-button-success p-button-rounded px-4"
          />
        </div>
      </template>
    </pv-card>








  </div>


</template>

<style scoped>

</style>