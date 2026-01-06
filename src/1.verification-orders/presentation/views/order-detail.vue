<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';
import CreateObservationDialog from '../components/create-observation-dialog.vue';
import ObservationsList from '../components/observations-list.vue';
import ReportView from '../components/report-view.vue';
import useVerificationOrderStore from '../../application/verification-order.store.js';
import { 
  UILabels, 
  StatusColors,
  OrderStatusTranslations
} from '../constants/verification-order-ui.constants.js';

// Router y stores
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const store = useVerificationOrderStore();

// Estados locales
const loading = ref(false);
const order = ref(null);
const createObservationDialogVisible = ref(false);
const activeView = ref('basic'); // 'basic' o 'report'

// Computed
const orderId = computed(() => parseInt(route.query.id));

const observations = computed(() => store.currentObservations);

// Métodos
async function loadOrder() {
  loading.value = true;
  try {
    const result = await store.fetchById(orderId.value);
    if (result.success) {
      order.value = result.data;
    } else {
      router.push({ name: 'verification-orders-list' });
    }
  } finally {
    loading.value = false;
  }
}

function openCreateObservationDialog() {
  createObservationDialogVisible.value = true;
}

async function onObservationCreated(observationData) {
  // Las observaciones se crean mediante el proceso principal de actualización de la orden
  await loadOrder();
}

async function onResolveObservation(observation) {
  // El estado se actualiza mediante el proceso principal de actualización de la orden
  await loadOrder();
}

async function onRejectObservation(observation) {
  // El estado se actualiza mediante el proceso principal de actualización de la orden
  await loadOrder();
}

async function onReopenObservation(observation) {
  // El estado se actualiza mediante el proceso principal de actualización de la orden
  await loadOrder();
}

async function onDeleteObservation(observation) {
  // La eliminación se maneja mediante el proceso principal de actualización de la orden
  await loadOrder();
}

function getStatusColor(status) {
  return StatusColors[status] || 'secondary';
}

function getStatusLabel(status) {
  return OrderStatusTranslations[status] || status;
}

function goBack() {
  router.push({ name: 'verification-orders-list' });
}

function toggleView() {
  activeView.value = activeView.value === 'basic' ? 'report' : 'basic';
}

async function handleExportPDF(order) {
  console.log('Exportando PDF:', order);
  // TODO: Implementar exportación PDF
}

async function handleExportExcel(order) {
  console.log('Exportando Excel:', order);
  // TODO: Implementar exportación Excel
}

function handleViewDocument(document) {
  if (document.fileUrl) {
    window.open(document.fileUrl, '_blank');
  }
}

function handleDownloadDocument(document) {
  if (document.fileUrl) {
    const link = window.document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.fileName || 'documento';
    link.click();
  }
}

function handleCallReference(reference) {
  if (reference.hasValidPhone) {
    window.open(`tel:${reference.phoneNumber}`);
  }
}

async function handleUpdateDwelling(dwellingData) {
  const result = await store.updateDwelling(orderId.value, dwellingData);
  if (result.success) {
    order.value.dwelling = result.data;
  }
}

async function handleUpdateZone(zoneData) {
  const result = await store.updateZone(orderId.value, zoneData);
  if (result.success) {
    order.value.zone = result.data;
  }
}

async function handleUpdateLocation(locationData) {
  const result = await store.updateLocation(orderId.value, locationData);
  if (result.success) {
    order.value.location = result.data;
  }
}

// Lifecycle
onMounted(() => {
  loadOrder();
});
</script>

<template>
  <div class="h-full w-full flex flex-column">
    
    <Toolbar 
      :title="order ? `${UILabels.DETAIL_TITLE} - ${order.orderCodeValue}` : UILabels.DETAIL_TITLE" 
      :description="order ? order.clientFullName : 'Cargando...'" 
      :show-back-button="true"
      @back="goBack"
    >
      <template #actions>
        <Button
          :label="activeView === 'basic' ? 'Ver Reporte Completo' : 'Vista Básica'"
          :icon="activeView === 'basic' ? 'pi pi-file-export' : 'pi pi-list'"
          severity="secondary"
          @click="toggleView"
        />
      </template>
    </Toolbar>

    <div class="flex-1 overflow-auto">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-content-center align-items-center" style="min-height: 300px;">
        <ProgressSpinner />
      </div>

      <!-- Contenido -->
      <div v-else-if="order" class="order-content p-4">
        <!-- Vista Básica -->
        <div v-if="activeView === 'basic'">
        <!-- Estado -->
        <Card class="p-mb-3">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <span>Estado de la Orden</span>
              <Tag 
                :value="getStatusLabel(order.status)" 
                :severity="getStatusColor(order.status)"
                class="text-lg"
              />
            </div>
          </template>
        </Card>

        <!-- Información General -->
        <Card class="p-mb-3">
          <template #title>Información General</template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">{{ UILabels.ORDER_CODE }}</label>
                  <p>{{ order.orderCodeValue }}</p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">{{ UILabels.REQUEST_DATE }}</label>
                  <p>{{ order.requestDate ? new Date(order.requestDate).toLocaleDateString('es-PE') : '-' }}</p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">{{ UILabels.STATUS }}</label>
                  <p>
                    <Tag 
                      :value="getStatusLabel(order.status)" 
                      :severity="getStatusColor(order.status)"
                    />
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Información del Cliente -->
        <Card v-if="order.client" class="p-mb-3">
          <template #title>Información del Cliente</template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Nombre Completo</label>
                  <p>{{ order.clientFullName }}</p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Teléfono</label>
                  <p>{{ order.client.phoneNumber || '-' }}</p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Email</label>
                  <p>{{ order.client.email || '-' }}</p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Empresa Solicitante -->
        <Card v-if="order.applicantCompany" class="p-mb-3">
          <template #title>Empresa Solicitante</template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Razón Social</label>
                  <p>{{ order.companyName }}</p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">RUC</label>
                  <p>{{ order.applicantCompany.ruc || '-' }}</p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Detalles de Visita -->
        <Card v-if="order.homeVisitDetails" class="p-mb-3">
          <template #title>Detalles de Visita</template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Verificador</label>
                  <p>{{ order.homeVisitDetails.verifierName || 'Sin asignar' }}</p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">{{ UILabels.VISIT_DATE }}</label>
                  <p>{{ order.visitDate ? new Date(order.visitDate).toLocaleDateString('es-PE') : 'Sin programar' }}</p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Hora de Visita</label>
                  <p>{{ order.homeVisitDetails.visitTime || '-' }}</p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Observaciones -->
        <Card class="p-mb-3">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <span>Observaciones</span>
              <Button
                label="Nueva Observación"
                icon="pi pi-plus"
                class="p-button-sm"
                @click="openCreateObservationDialog"
              />
            </div>
          </template>
          <template #content>
            <ObservationsList
              :observations="observations"
              :loading="observationsLoading"
              @resolve="onResolveObservation"
              @reject="onRejectObservation"
              @reopen="onReopenObservation"
              @delete="onDeleteObservation"
            />
          </template>
        </Card>

        <!-- Reporte -->
        <Card v-if="order.report" class="p-mb-3">
          <template #title>Reporte</template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Estado del Reporte</label>
                  <p>
                    <Tag :value="order.report.status" severity="info" />
                  </p>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="field">
                  <label class="font-semibold">Fecha de Finalización</label>
                  <p>{{ order.report.completedAt ? new Date(order.report.completedAt).toLocaleDateString('es-PE') : '-' }}</p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Vista de Reporte Completo -->
      <div v-else>
        <ReportView 
          :order="order"
          @export-pdf="handleExportPDF"
          @export-excel="handleExportExcel"
          @view-document="handleViewDocument"
          @download-document="handleDownloadDocument"
          @call-reference="handleCallReference"
          @update:dwelling="handleUpdateDwelling"
          @update:zone="handleUpdateZone"
          @update:location="handleUpdateLocation"
        >
          <template #observations>
            <Card>
              <template #title>
                <div class="flex justify-content-between align-items-center">
                  <span>Observaciones</span>
                  <Button
                    label="Nueva Observación"
                    icon="pi pi-plus"
                    size="small"
                    @click="openCreateObservationDialog"
                  />
                </div>
              </template>
              <template #content>
                <ObservationsList
                  :observations="observations"
                  :loading="observationsLoading"
                  @resolve="onResolveObservation"
                  @reject="onRejectObservation"
                  @reopen="onReopenObservation"
                  @delete="onDeleteObservation"
                />
              </template>
            </Card>
          </template>
        </ReportView>
      </div>
      </div>

      <!-- No encontrado -->
      <div v-else class="flex justify-content-center align-items-center p-5">
      <div class="text-center">
        <i class="pi pi-exclamation-circle" style="font-size: 3rem; color: var(--red-500)"></i>
        <h3>Orden no encontrada</h3>
        <Button label="Volver al listado" @click="goBack" />
      </div>
    </div>
    </div>

    <!-- Dialogs -->
    <CreateObservationDialog
      v-model:visible="createObservationDialogVisible"
      :orderId="orderId"
      @created="onObservationCreated"
    />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.verification-order-detail {
  padding: 1.5rem;
}

.order-content .field {
  margin-bottom: 1rem;
}

.order-content .field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color-secondary);
}

.order-content .field p {
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .verification-order-detail {
    padding: 1rem;
  }
}
</style>
