<script>
import { Verifier } from "../models/verifiers.entity.js";

export default {
  name: "verifier-data-and-edit",

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isEdit: false,
      submitted: false,
      editableItem: new Verifier({}),

      //
      optionsStatus: ["Activo", "Inactivo"],

    };
  },

  methods: {
    saveVerifier() {
      this.isEdit = false;
      this.submitted = true;
      this.$emit("save-verifier", new Verifier({ ...this.editableItem })); // emitimos el objeto editado
    },

    editVerifier() {
      this.isEdit = true;
      this.editableItem = new Verifier({ ...this.item }); // clonar para edición
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
        <h3 class="text-lg font-bold mb-4 text-primary"> Datos del verificador:</h3>

        <div class="formgrid grid">
          <!-- Fila 1 -->
          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary">Nombres</label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.name }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.name" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary">Apellidos</label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.lastname }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.lastname" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-3">
            <label class="font-semibold text-color-secondary">Contacto</label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.phone }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.phone" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-2">
            <label class="font-semibold text-color-secondary">Estado</label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.status }}</p>
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
            <label class="font-semibold text-color-secondary">Cant. órdenes</label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.assignedOrders.length }}</p>
            </div>
            <div v-else>
              <pv-input-number v-model="editableItem.assignedOrders.length" class="w-full" />
            </div>
          </div>

          <!-- Fila 2 -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary">Correo</label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">{{ item.email }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableItem.email" class="w-full" />
            </div>
          </div>

          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary">Contraseña</label>
            <div v-if="!isEdit">
              <p class="font-semibold text-dark m-0">********</p>
            </div>
            <div v-else>
              <pv-password v-model="editableItem.password" toggleMask class="w-full"  />
            </div>
          </div>

          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary">Agenda</label>
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
              class="p-button-success w-10rem"
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
