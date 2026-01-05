<script setup>
import { ref, computed, watch } from 'vue';
import { CustomerValidators } from '../../domain/validators/customer.validators.js';
import CreateAndEdit from '../../../shared/components/create-and-edit.component.vue';

const props = defineProps({
    edit: Boolean,
    item: Object,
    visible: Boolean
});

const emit = defineEmits(['cancel-requested', 'save-requested']);

// State
const submitted = ref(false);
const customerForm = ref({
    ruc: '',
    companyName: '',
    status: 'ACTIVE'
});

// Computed
const isFormValid = computed(() => {
    const rucValid = customerForm.value.ruc && validateRuc(customerForm.value.ruc);
    const companyNameValid = customerForm.value.companyName && validateCompanyName(customerForm.value.companyName);
    return rucValid && companyNameValid;
});

// Status options
const statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
];

// Validation methods
const validateRuc = (ruc) => {
    try {
        CustomerValidators.validateRuc(ruc);
        return true;
    } catch {
        return false;
    }
};

const validateCompanyName = (name) => {
    try {
        CustomerValidators.validateCompanyName(name);
        return true;
    } catch {
        return false;
    }
};

// Methods
const cancelRequested = () => {
    submitted.value = false;
    resetForm();
    emit('cancel-requested');
};

const saveRequested = () => {
    submitted.value = true;
    
    if (isFormValid.value) {
        const customerData = { ...customerForm.value };
        
        // Include ID if editing
        if (props.edit && props.item) {
            customerData.id = props.item.id;
        }
        
        emit('save-requested', customerData);
        resetForm();
    }
};

const resetForm = () => {
    customerForm.value = {
        ruc: '',
        companyName: '',
        status: 'ACTIVE'
    };
    submitted.value = false;
};

// Watch for dialog open
watch(() => props.visible, (newValue) => {
    if (newValue && props.edit && props.item) {
        customerForm.value = {
            ruc: props.item.ruc || '',
            companyName: props.item.companyName || '',
            status: props.item.status || 'ACTIVE'
        };
    } else if (newValue && !props.edit) {
        resetForm();
    }
});
</script>

<template>
    <create-and-edit
        :entity="customerForm"
        :visible="visible"
        entity-name="Cliente"
        :edit="edit"
        size="standard"
        @canceled-shared="cancelRequested"
        @saved-shared="saveRequested"
    >
        <template #content>

        <div class="grid p-2">
            <!-- Fila 1: RUC y Nombre de Empresa -->
            <div class="col-12 md:col-6 px-2 pb-1">
                <div class="field">
                    <label for="ruc" class="block text-900 font-medium mb-2">
                        <i class="pi pi-id-card mr-2"></i>RUC *
                    </label>
                    <pv-input-text
                        id="ruc"
                        v-model="customerForm.ruc"
                        class="w-full"
                        size="small"
                        placeholder="Ingrese el RUC (11 dígitos)"
                        maxlength="11"
                        @keypress="(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }"
                        :class="{ 'p-invalid': submitted && (!customerForm.ruc || !validateRuc(customerForm.ruc)) }"
                    />
                    <small v-if="submitted && !customerForm.ruc" class="p-error">
                        El RUC es requerido
                    </small>
                    <small v-else-if="submitted && customerForm.ruc && !validateRuc(customerForm.ruc)" class="p-error">
                        El RUC debe tener exactamente 11 dígitos numéricos
                    </small>
                </div>
            </div>

            <div class="col-12 md:col-6 px-2 pb-1">
                <div class="field">
                    <label for="companyName" class="block text-900 font-medium mb-2">
                        <i class="pi pi-building mr-2"></i>Nombre de la Empresa *
                    </label>
                    <pv-input-text
                        id="companyName"
                        v-model="customerForm.companyName"
                        class="w-full"
                        size="small"
                        placeholder="Ingrese el nombre de la empresa"
                        :class="{ 'p-invalid': submitted && (!customerForm.companyName || !validateCompanyName(customerForm.companyName)) }"
                    />
                    <small v-if="submitted && !customerForm.companyName" class="p-error">
                        El nombre de la empresa es requerido
                    </small>
                    <small v-else-if="submitted && customerForm.companyName && !validateCompanyName(customerForm.companyName)" class="p-error">
                        El nombre debe tener entre 3 y 100 caracteres
                    </small>
                </div>
            </div>

            <!-- Fila 2: Estado (solo en modo edición) -->
            <div v-if="edit" class="col-12 md:col-6 px-2 pb-1">
                <div class="field">
                    <label for="status" class="block text-900 font-medium mb-2">
                        <i class="pi pi-check-circle mr-2"></i>Estado
                    </label>
                    <pv-select
                        id="status"
                        v-model="customerForm.status"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione el estado"
                        class="w-full"
                        size="small"
                    />
                </div>
            </div>
        </div>
        </template>
    </create-and-edit>
</template>

<style scoped>
/* Using corporate design system */
</style>
