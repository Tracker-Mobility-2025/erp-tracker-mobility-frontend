<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerStore } from '../../application/customer.store.js';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import EmployeeCollaboratorCreateAndEdit from '../components/employee-collaborator-create-and-edit.vue';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';
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

// Lifecycle
onMounted(async () => {
    customerId.value = route.query.id;
    if (customerId.value) {
        await customerStore.fetchById(customerId.value);
        await customerStore.fetchEmployees(customerId.value);
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

        <!-- Filters Card -->
        <div class="card p-4 mb-4">
            <div class="flex flex-column md:flex-row gap-3 align-items-stretch md:align-items-center">
                <!-- Search -->
                <pv-icon-field class="flex-grow-1">
                    <pv-input-icon class="pi pi-search" />
                    <pv-input-text
                        v-model="search"
                        :placeholder="EmployeeUILabels.placeholders.search"
                        class="w-full"
                    />
                </pv-icon-field>

                <!-- Status Filter -->
                <div class="w-full md:w-auto" style="min-width: 200px">
                    <pv-dropdown
                        v-model="selectStatus"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Filtrar por estado"
                        class="w-full md:w-auto"
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
                </div>

                <!-- Clear Filters -->
                <div class="w-full md:w-auto">
                    <pv-button
                        :label="EmployeeUILabels.buttons.clearFilters"
                        icon="pi pi-filter-slash"
                        class="p-button-secondary p-button-outlined w-full"
                        style="white-space: nowrap;"
                        @click="onClearFilters"
                    />
                </div>

                <!-- Add Employee -->
                <div class="w-full md:w-auto">
                    <pv-button
                        :label="EmployeeUILabels.buttons.new"
                        icon="pi pi-plus"
                        severity="success"
                        @click="onNewItem"
                        class="w-full md:w-auto"
                        style="white-space: nowrap;"
                    />
                </div>
            </div>
        </div>

        <!-- Employees Table -->
        <div class="card flex-grow-1" style="min-height: 0;">
            <pv-data-table
                :value="filteredEmployees"
                :loading="customerStore.loading"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 15, 20]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} colaboradores"
                class="h-full"
                scrollable
                scrollHeight="flex"
            >
                <template #empty>
                    <div class="text-center p-4">
                        <i class="pi pi-users text-6xl text-400 mb-3 block"></i>
                        <h3 class="text-dark mb-2">{{ EmployeeUILabels.messages.noEmployees }}</h3>
                        <p class="text-muted mb-4">{{ EmployeeUILabels.messages.addFirstEmployee }}</p>
                    </div>
                </template>

                <pv-column field="name" header="Nombres" sortable style="min-width: 150px"></pv-column>
                <pv-column field="lastName" header="Apellidos" sortable style="min-width: 150px"></pv-column>
                <pv-column field="email" header="Email" sortable style="min-width: 200px"></pv-column>
                <pv-column field="phoneNumber" header="Teléfono" sortable style="min-width: 130px"></pv-column>
                <pv-column field="status" header="Estado" sortable style="min-width: 120px">
                    <template #body="{ data }">
                        <pv-tag
                            :value="StatusTranslations[data.status]"
                            :severity="getStatusSeverity(data.status)"
                            class="text-sm"
                        />
                    </template>
                </pv-column>
                <pv-column header="Acciones" style="min-width: 120px">
                    <template #body="{ data }">
                        <div class="flex gap-2 justify-content-center">
                            <pv-button
                                icon="pi pi-pencil"
                                class="p-button-outlined btn-edit"
                                size="small"
                                @click="onEditItem(data)"
                                v-tooltip.top="'Editar'"
                            />
                            <pv-button
                                icon="pi pi-trash"
                                class="p-button-outlined btn-delete"
                                size="small"
                                @click="onDeleteItem(data)"
                                v-tooltip.top="'Eliminar'"
                            />
                        </div>
                    </template>
                </pv-column>
            </pv-data-table>
        </div>

        <!-- Create/Edit Dialog -->
        <employee-collaborator-create-and-edit
            :edit="isEdit"
            :item="itemEmployee"
            :visible="createAndEditDialogIsVisible"
            :customer-id="customerId"
            @cancel-requested="onCancelRequested"
            @save-requested="onSaveRequested"
        />
        </div>
    </div>
</template>

<style scoped>
/* Using corporate design system */
</style>
