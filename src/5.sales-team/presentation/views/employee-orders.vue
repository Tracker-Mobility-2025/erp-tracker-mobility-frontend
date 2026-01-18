<template>
    <div class="employee-orders-view">
        <!-- Toolbar Header -->
        <Toolbar 
            :title="`Órdenes de ${selectedEmployee?.name || 'Vendedor'}`" 
            :icon="'pi-shopping-cart'"
            :show-back="true"
            @back="goBack"
        />

        <div class="container-fluid px-4 py-4">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-content-center align-items-center" style="min-height: 400px;">
                <pv-progress-spinner />
            </div>

            <!-- Empty State -->
            <div v-else-if="orders.length === 0" class="text-center py-6">
                <i class="pi pi-inbox text-6xl text-400 mb-4"></i>
                <h3 class="text-600 mb-2">No hay órdenes</h3>
                <p class="text-500">Este vendedor aún no tiene órdenes registradas</p>
            </div>

            <!-- Orders List -->
            <div v-else>
                <pv-data-table 
                    :value="orders" 
                    :paginator="true" 
                    :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]"
                    responsiveLayout="scroll"
                    class="p-datatable-sm"
                >
                    <pv-column field="id" header="ID" sortable style="min-width: 80px"></pv-column>
                    <pv-column field="orderNumber" header="Nº Orden" sortable style="min-width: 120px"></pv-column>
                    <pv-column field="customerName" header="Cliente" sortable style="min-width: 200px"></pv-column>
                    <pv-column field="date" header="Fecha" sortable style="min-width: 120px"></pv-column>
                    <pv-column field="status" header="Estado" sortable style="min-width: 120px">
                        <template #body="{ data }">
                            <pv-tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                        </template>
                    </pv-column>
                    <pv-column header="Acciones" style="min-width: 120px">
                        <template #body="{ data }">
                            <pv-button 
                                label="Ver Detalles"
                                icon="pi pi-eye"
                                size="small"
                                outlined
                                @click="viewOrderDetail(data)"
                            />
                        </template>
                    </pv-column>
                </pv-data-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSalesTeamStore } from '../../application/sales-team.store.js';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

const router = useRouter();
const route = useRoute();
const salesTeamStore = useSalesTeamStore();

// Computed
const loading = computed(() => salesTeamStore.loading);
const selectedEmployee = computed(() => salesTeamStore.selectedEmployee);
const orders = computed(() => salesTeamStore.employeeOrders);

// Methods
const getStatusSeverity = (status) => {
    const severities = {
        PENDING: 'warning',
        IN_PROGRESS: 'info',
        COMPLETED: 'success',
        CANCELLED: 'danger'
    };
    return severities[status] || 'secondary';
};

const viewOrderDetail = (order) => {
    router.push({
        name: 'order-detail',
        params: { orderId: order.id }
    });
};

const goBack = () => {
    router.push({ name: 'sales-team-list' });
};

// Lifecycle
onMounted(async () => {
    const employeeId = route.params.employeeId;
    if (employeeId) {
        await salesTeamStore.fetchEmployeeOrders(employeeId);
    }
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
