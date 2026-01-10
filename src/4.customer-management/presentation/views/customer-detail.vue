<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerStore } from '../../application/customer.store.js';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import EmployeeCollaboratorCreateAndEdit from '../components/employee-collaborator-create-and-edit.vue';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';
import DataManager from '../../../shared-v2/presentation/components/data-manager.vue';
import {
    StatusTranslations,
    StatusFilterOptions,
    EmployeeUILabels
} from '../constants/customer-ui.constants.js';

const route = useRoute();
const customerStore = useCustomerStore();
const confirm = useConfirm();
const toast = useToast();

// State
const customerId = ref(null);
const search = ref('');
const selectStatus = ref('');
const isEdit = ref(false);
const itemEmployee = ref(null);
const createAndEditDialogIsVisible = ref(false);

// Loading states
const isLoading = ref(true);
const loadingStep = ref(0);
const loadingSteps = [
    { icon: 'pi-building', label: 'Datos del cliente' },
    { icon: 'pi-users', label: 'Colaboradores' },
    { icon: 'pi-check', label: 'Completado' }
];

// Status options
const statusOptions = StatusFilterOptions;

// Computed
const customer = computed(() => customerStore.currentCustomer);

const filteredEmployees = computed(() => {
    let filtered = customerStore.employees;

    // Filter by search text
    if (search.value && search.value.trim().length > 0) {
        const searchLower = search.value.toLowerCase().trim();
        filtered = filtered.filter(employee =>
            (employee.name && employee.name.toLowerCase().includes(searchLower)) ||
            (employee.lastName && employee.lastName.toLowerCase().includes(searchLower)) ||
            (employee.email && employee.email.toLowerCase().includes(searchLower)) ||
            (employee.phoneNumber && employee.phoneNumber.toLowerCase().includes(searchLower))
        );
    }

    // Filter by status
    if (selectStatus.value) {
        filtered = filtered.filter(employee => employee.status === selectStatus.value);
    }

    return filtered;
});

// Columns configuration for data-manager
const columns = ref([
    { field: 'name', header: 'Nombres', sortable: true, style: 'min-width: 150px' },
    { field: 'lastName', header: 'Apellidos', sortable: true, style: 'min-width: 150px' },
    { field: 'email', header: 'Email', sortable: true, style: 'min-width: 150px' },
    { field: 'phoneNumber', header: 'Teléfono', sortable: true, style: 'min-width: 100px' },
    { field: 'brandName', header: 'Marca', sortable: true, style: 'min-width: 150px', template: 'brandName' },
    { field: 'roles', header: 'Rol', sortable: true, style: 'min-width: 120px', template: 'roles' },
    { field: 'status', header: 'Estado', sortable: true, style: 'min-width: 120px', template: 'status' }
]);

const statusProps = computed(() => {
    if (customer.value?.isActive()) {
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
});

// Methods
const getCountByStatus = (status) => {
    return customerStore.employees.filter(e => e.status === status).length;
};

const getStatusSeverity = (status) => {
    return status === 'ACTIVE' ? 'success' : 'danger';
};

const onNewItem = () => {
    itemEmployee.value = null;
    isEdit.value = false;
    createAndEditDialogIsVisible.value = true;
};

const onCancelRequested = () => {
    isEdit.value = false;
    itemEmployee.value = null;
    createAndEditDialogIsVisible.value = false;
};

const onSaveRequested = async (employeeData) => {
    let result;
    
    if (isEdit.value) {
        result = await customerStore.updateEmployee(customerId.value, employeeData.id, employeeData);
    } else {
        result = await customerStore.createEmployee(customerId.value, employeeData);
    }
    
    if (result.success) {
        const action = isEdit.value ? 'actualizado' : 'creado';
        toast.add({
            severity: 'success',
            summary: `Colaborador ${action}`,
            detail: `El colaborador ${employeeData.name} ${employeeData.lastName} ha sido ${action} exitosamente`,
            life: 4000
        });
        createAndEditDialogIsVisible.value = false;
        isEdit.value = false;
        itemEmployee.value = null;
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: result.message || 'No se pudo guardar el colaborador',
            life: 4000
        });
    }
};

const onClearFilters = () => {
    search.value = '';
    selectStatus.value = '';
};

const onEditItem = (employee) => {
    itemEmployee.value = employee;
    isEdit.value = true;
    createAndEditDialogIsVisible.value = true;
};

const onDeleteItem = (employee) => {
    confirm.require({
        message: `¿Está seguro de eliminar al colaborador ${employee.name} ${employee.lastName}?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar',
        acceptClass: 'p-button-danger',
        accept: async () => {
            const result = await customerStore.deleteEmployee(customerId.value, employee.id);
            
            if (result.success) {
                toast.add({
                    severity: 'success',
                    summary: 'Colaborador eliminado',
                    detail: 'El colaborador ha sido eliminado exitosamente',
                    life: 4000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error al eliminar',
                    detail: result.message || 'No se pudo eliminar el colaborador',
                    life: 4000
                });
            }
        }
    });
};

const simulateLoadingProgress = () => {
    const progressInterval = setInterval(() => {
        if (loadingStep.value < loadingSteps.length - 1) {
            loadingStep.value++;
        } else {
            clearInterval(progressInterval);
        }
    }, 700);
    
    setTimeout(() => {
        clearInterval(progressInterval);
    }, 4000);
};

const clearData = () => {
    // Limpiar datos SÍNCRONAMENTE (inmediato, sin await)
    customerStore.currentCustomer = null;
    customerStore.employees = [];
    search.value = '';
    selectStatus.value = '';
    loadingStep.value = 0;
};

const loadData = async (newCustomerId) => {
    if (newCustomerId) {
        isLoading.value = true;
        loadingStep.value = 0;
        simulateLoadingProgress();
        
        await customerStore.fetchById(newCustomerId);
        await customerStore.fetchEmployees(newCustomerId);
        
        loadingStep.value = loadingSteps.length;
        isLoading.value = false;
    }
};

// Lifecycle
onMounted(async () => {
    customerId.value = route.query.id;
    clearData();
    await loadData(customerId.value);
});

// Watch for route changes
watch(() => route.query.id, async (newId) => {
    if (newId && newId !== customerId.value) {
        customerId.value = newId;
        clearData(); // Limpiar INMEDIATAMENTE (síncrono)
        await loadData(newId); // Luego cargar (asíncrono)
    }
});
</script>

<template>
  
    <div class="h-full w-full flex flex-column">
        <!-- Toolbar -->
        <toolbar
            :title="customer ? `Gestión de Colaboradores - ${customer.companyName}` : 'Gestión de Colaboradores'"
            :description="customer ? 'Credenciales y contacto de colaboradores' : 'Cargando información del cliente...'"
            :show-back-button="true"
            :back-route="{ name: 'customers' }"
        >
            <template #actions>
                <!-- Customer Status Badge -->
                <div 
                    v-if="customer" 
                    :class="['flex align-items-center gap-2 px-3 py-2 border-round border-1', statusProps.container]"
                >
                    <i :class="statusProps.icon"></i>
                    <span class="font-semibold text-sm">Estado del cliente:</span>
                    <span class="font-bold">{{ StatusTranslations[customer.status] }}</span>
                </div>
            </template>
        </toolbar>

        <div class="flex-1 p-4 overflow-auto">

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
            <div class="loading-content">
                <pv-progress-spinner 
                    size="48" 
                    stroke-width="4" 
                    animation-duration="1.2s" 
                    class="loading-spinner"
                />
                
                <div class="loading-text">
                    <h3 class="loading-title">Cargando información del cliente</h3>
                    <p class="loading-subtitle">{{ loadingSteps[loadingStep]?.label || 'Preparando datos...' }}</p>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div v-else class="flex-grow-1 flex flex-column" style="min-height: 0;">
            <!-- Data Manager Component -->
            <data-manager
                :items="customerStore.employees"
                :filtered-items="filteredEmployees"
                :title="{ singular: 'colaborador', plural: 'colaboradores' }"
                :columns="columns"
                :loading="customerStore.loading"
                :dynamic="true"
                :show-selection="false"
                :show-export="false"
                :show-delete="false"
                :show-view-action="false"
                :show-edit-action="true"
                :show-delete-action="true"
                search-placeholder="Buscar por nombre, apellido, email o teléfono..."
                new-button-label="Nuevo Colaborador"
                @new-item-requested-manager="onNewItem"
                @edit-item-requested-manager="onEditItem"
                @delete-item-requested-manager="onDeleteItem"
                @global-filter-change="(value) => search = value"
                @clear-filters="onClearFilters"
            >
                <!-- Custom filters slot -->
                <template #filters="{ clearFilters }">
                    <pv-dropdown
                        v-model="selectStatus"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Filtrar por estado"
                        class="w-full md:w-auto"
                        style="min-width: 200px"
                    >
                        <template #option="slotProps">
                            <div class="flex align-items-center justify-content-between w-full">
                                <span>{{ slotProps.option.label }}</span>
                                <span 
                                    v-if="slotProps.option.value !== ''"
                                    class="badge badge-primary ml-2"
                                >
                                    {{ getCountByStatus(slotProps.option.value) }}
                                </span>
                                <span v-else class="badge badge-secondary ml-2">
                                    {{ customerStore.employees.length }}
                                </span>
                            </div>
                        </template>
                    </pv-dropdown>
                    
                    <pv-button
                        label="Limpiar filtros"
                        icon="pi pi-filter-slash"
                        class="p-button-secondary p-button-outlined"
                        @click="clearFilters"
                    />
                </template>

                <!-- Custom column templates -->
                <template #brandName="{ data }">
                    <span class="badge bg-blue-100 text-blue-700 text-sm px-2 py-1">
                        {{ data.brandName || 'Sin marca' }}
                    </span>
                </template>

                <template #roles="{ data }">
                    <span class="badge bg-purple-100 text-purple-700 text-sm px-2 py-1">
                        {{ data.roles?.[0] || 'Sin rol' }}
                    </span>
                </template>

                <template #status="{ data }">
                    <pv-tag
                        :value="StatusTranslations[data.status]"
                        :severity="getStatusSeverity(data.status)"
                        class="text-sm"
                    />
                </template>

                <!-- Empty state -->
                <template #empty>
                    <div class="text-center p-4">
                        <i class="pi pi-users text-6xl text-400 mb-3 block"></i>
                        <h3 class="text-dark mb-2">{{ EmployeeUILabels.messages.noEmployees }}</h3>
                        <p class="text-muted mb-4">{{ EmployeeUILabels.messages.addFirstEmployee }}</p>
                    </div>
                </template>
            </data-manager>

        <!-- Create/Edit Dialog -->
        <employee-collaborator-create-and-edit
            :edit="isEdit"
            :item="itemEmployee"
            :visible="createAndEditDialogIsVisible"
            :customer-id="customerId"
            :customer-brands="customer?.brands || []"
            @cancel-requested="onCancelRequested"
            @save-requested="onSaveRequested"
        />
        </div>
        </div>
    </div>
</template>

<style scoped>
/* Loading Styles */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem;
}

.loading-content {
  text-align: center;
  max-width: 400px;
}

.loading-spinner {
  margin-bottom: 1.5rem;
}

.loading-text {
  margin-top: 1rem;
}

.loading-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.loading-subtitle {
  font-size: 1rem;
  color: var(--text-color-secondary);
  margin: 0;
}
</style>
