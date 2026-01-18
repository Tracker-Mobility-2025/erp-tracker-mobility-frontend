<template>
    <div class="order-detail-view">
        <!-- Toolbar Header -->
        <Toolbar 
            :title="`Detalle de Orden #${selectedOrder?.orderNumber || ''}`" 
            :icon="'pi-file-check'"
            :show-back="true"
            @back="goBack"
        />

        <div class="container-fluid px-4 py-4">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-content-center align-items-center" style="min-height: 400px;">
                <pv-progress-spinner />
            </div>

            <!-- Order Detail -->
            <div v-else-if="selectedOrder" class="grid">
                <!-- Información General -->
                <div class="col-12 lg:col-8">
                    <pv-card>
                        <template #title>
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-info-circle text-primary"></i>
                                <span>Información General</span>
                            </div>
                        </template>
                        <template #content>
                            <div class="grid">
                                <div class="col-12 md:col-6">
                                    <label class="block text-600 font-semibold mb-2">Nº de Orden</label>
                                    <p class="text-900 text-xl m-0">{{ selectedOrder.orderNumber }}</p>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label class="block text-600 font-semibold mb-2">Estado</label>
                                    <pv-tag :value="selectedOrder.status" :severity="getStatusSeverity(selectedOrder.status)" />
                                </div>
                                <div class="col-12 md:col-6">
                                    <label class="block text-600 font-semibold mb-2">Cliente</label>
                                    <p class="text-900 m-0">{{ selectedOrder.customerName }}</p>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label class="block text-600 font-semibold mb-2">Fecha</label>
                                    <p class="text-900 m-0">{{ selectedOrder.date }}</p>
                                </div>
                                <div class="col-12">
                                    <label class="block text-600 font-semibold mb-2">Descripción</label>
                                    <p class="text-900 m-0">{{ selectedOrder.description || 'Sin descripción' }}</p>
                                </div>
                            </div>
                        </template>
                    </pv-card>

                    <!-- Productos/Items -->
                    <pv-card class="mt-3">
                        <template #title>
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-box text-primary"></i>
                                <span>Items de la Orden</span>
                            </div>
                        </template>
                        <template #content>
                            <div class="text-center text-500 py-4">
                                <i class="pi pi-inbox text-5xl mb-3"></i>
                                <p>Detalles de items pendientes de implementación</p>
                            </div>
                        </template>
                    </pv-card>
                </div>

                <!-- Sidebar con información adicional -->
                <div class="col-12 lg:col-4">
                    <pv-card>
                        <template #title>
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-user text-primary"></i>
                                <span>Vendedor</span>
                            </div>
                        </template>
                        <template #content>
                            <div class="flex flex-column gap-3">
                                <div>
                                    <label class="block text-600 font-semibold mb-1">Nombre</label>
                                    <p class="text-900 m-0">{{ selectedOrder.salesPersonName || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="block text-600 font-semibold mb-1">Email</label>
                                    <p class="text-900 m-0">{{ selectedOrder.salesPersonEmail || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="block text-600 font-semibold mb-1">Teléfono</label>
                                    <p class="text-900 m-0">{{ selectedOrder.salesPersonPhone || 'N/A' }}</p>
                                </div>
                            </div>
                        </template>
                    </pv-card>

                    <pv-card class="mt-3">
                        <template #title>
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-calendar text-primary"></i>
                                <span>Fechas</span>
                            </div>
                        </template>
                        <template #content>
                            <div class="flex flex-column gap-3">
                                <div>
                                    <label class="block text-600 font-semibold mb-1">Creación</label>
                                    <p class="text-900 m-0">{{ selectedOrder.createdAt || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="block text-600 font-semibold mb-1">Última actualización</label>
                                    <p class="text-900 m-0">{{ selectedOrder.updatedAt || 'N/A' }}</p>
                                </div>
                            </div>
                        </template>
                    </pv-card>
                </div>
            </div>

            <!-- Error State -->
            <div v-else class="text-center py-6">
                <i class="pi pi-exclamation-circle text-6xl text-red-400 mb-4"></i>
                <h3 class="text-600 mb-2">Orden no encontrada</h3>
                <p class="text-500">No se pudieron cargar los detalles de esta orden</p>
                <pv-button label="Volver" icon="pi pi-arrow-left" @click="goBack" class="mt-3" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSalesTeamStore } from '../../application/sales-team.store.js';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

const router = useRouter();
const route = useRoute();
const salesTeamStore = useSalesTeamStore();

// Computed
const loading = computed(() => salesTeamStore.loading);
const selectedOrder = computed(() => salesTeamStore.selectedOrder);

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

const goBack = () => {
    router.back();
};

// Lifecycle
onMounted(async () => {
    const orderId = route.params.orderId;
    if (orderId) {
        await salesTeamStore.fetchOrderDetail(orderId);
    }
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
