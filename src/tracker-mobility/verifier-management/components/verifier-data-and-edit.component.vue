<script>
import { Verifier } from "../models/verifiers.entity.js";

export default {
  name: "verifier-data-and-edit",

  props: {
    item: {
      type: Object,
      required: true,
    },

    cantOrders: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  data() {
    return {
      isEdit: false,
      submitted: false,
      editableItem: new Verifier({}),
      localCantOrders: 0, // Variable local para editar cantOrders

      //
      optionsStatus: ["ACTIVO", "INACTIVO"],

    };
  },

  methods: {

    saveVerifier() {
      this.isEdit = false;
      this.submitted = true;

      // Parsear status de Español a inglés
      if (this.editableItem.status === "ACTIVO") {
        this.editableItem.status = "ACTIVE";
      } else if (this.editableItem.status === "INACTIVO") {
        this.editableItem.status = "INACTIVE";
      }

      this.$emit("save-verifier", this.editableItem); // emitimos el objeto editado
    },

    editVerifier() {
      this.isEdit = true;
      this.editableItem = new Verifier({ ...this.item }); // clonar para edición
      this.localCantOrders = this.cantOrders; // Sincronizar cantOrders
    },

    cancelEdit() {
      this.isEdit = false;
      this.editableItem = new Verifier({ ...this.item }); // clonar para edición
      this.$emit("cancel-edit", this.item);
    },
  },

  created() {


  },
};
</script>

<template>

  <div class="flex flex-column gap-4">

    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-user-edit"></i>
          Datos del verificador:
        </h3>

        <div class="formgrid grid">
          <!-- Fila 1 -->
          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user"></i>
              Nombres
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item?.name }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.name" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-users"></i>
              Apellidos
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item?.lastName }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.lastName" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-3">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone"></i>
              Contacto
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item?.phoneNumber }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.phoneNumber" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-check-circle"></i>
              Estado
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item?.status }}</p>
            </div>
            <div v-else>
              <pv-dropdown
                  v-model="editableItem.status"
                  :options="optionsStatus"
                  class="w-full"
              />
            </div>
          </div>

          <div class="field col-12 md:col-3">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-list"></i>
              Cant. órdenes
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ cantOrders }}</p>
            </div>
            <div v-else>
              <pv-input-number v-model="localCantOrders" class="w-full" />
            </div>
          </div>

          <!-- Fila 2 -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-envelope"></i>
              Correo
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.email }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.email" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-lock"></i>
              Contraseña
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">*************</p>
            </div>
            <div v-else>
              <pv-password v-model="editableItem.password" toggleMask class="w-full"  />
            </div>
          </div>

          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-calendar"></i>
              Agenda
            </label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.agenda }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.agenda" class="w-full" />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-content-center gap-3 ">
          <pv-button
              v-if="!isEdit"
              label="Editar"
              icon="pi pi-pencil"
              class="p-button-warning w-10rem"
              @click="editVerifier"
          />
          <pv-button
              v-if="isEdit"
              label="Guardar"
              icon="pi pi-save"
              class="p-button-primary w-10rem"
              @click="saveVerifier"
          />
          <pv-button
              v-if="isEdit"
              label="Cancelar"
              icon="pi pi-times"
              class="p-button-secondary w-10rem"
              @click="cancelEdit"
          />
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

:deep(.p-inputtext) {
  width: 100%;
}

</style>
