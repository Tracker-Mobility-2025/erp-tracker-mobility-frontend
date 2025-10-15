<script>
// Importar los componentes de tarjetas
import VisitDetailsCard from '../components/1-visit-details-card.component.vue'
import ApplicantDataCard from '../components/2-applicant-data-card.component.vue'
import CustomerDataCard from '../components/3-customer-data-card.component.vue'
import CustomerAddressCard from '../components/4-customer-address-card.component.vue'
import ResidenceDetailsCard from '../components/5-details-residence-dwelling-garage-card.component.vue'
import LandlordDataCard from '../components/6-landlord-data-card.component.vue'
import InterviewDetailsCard from '../components/7-details-the-interview-with-the-landlord-card.component.vue'
import ObservationsCard from '../components/8-observations-the-report-card.component.vue'
import ReportSummaryCard from '../components/9-report-summary-card.component.vue'
import ReportGlossaryCard from '../components/10-report-glossary-card.component.vue'
import CasuistryReportCard from '../components/11-casuistry-report-card.component.vue'
import Annexe01DomicileCard from '../components/12-annexes-the-report-card.component.vue'
import Annexe02SurroundingsCard from '../components/13-annexe-02-surroundings-card.component.vue'
import Annexe03CandidateCard from '../components/14-annexe-03-candidate-card.component.vue'
import Annexe04GarageLocationCard from '../components/15-annexe-04-garage-location-card.component.vue'
import Annexe05RoomsCard from '../components/16-annexe-05-rooms-card.component.vue'
import Annexe06DomicileLocationCard from '../components/17-annexe-06-domicile-location-card.component.vue'
import {ReportApiService} from "../services/reports-api.service.js";

export default {
  name:'details-home-verification-report',

  components: {
    VisitDetailsCard,
    ApplicantDataCard,
    CustomerDataCard,
    CustomerAddressCard,
    ResidenceDetailsCard,
    LandlordDataCard,
    InterviewDetailsCard,
    ObservationsCard,
    ReportSummaryCard,
    ReportGlossaryCard,
    CasuistryReportCard,
    Annexe01DomicileCard,
    Annexe02SurroundingsCard,
    Annexe03CandidateCard,
    Annexe04GarageLocationCard,
    Annexe05RoomsCard,
    Annexe06DomicileLocationCard
  },

  props: {
    item: {
      type: Object,
      required: false,
    },
  },

  computed: {
    // Mapear datos de detalles de visita
    visitDetails() {
      return {
        verifier: this.item?.order?.homeVisitDetails?.verifierName || 
                 `Verificador ID: ${this.item?.order?.homeVisitDetails?.verifierId}` || 'No especificado',
        googleMapsLink: this.item?.order?.client?.location?.mapLocation || '#',
        verificationDate: this.formatDate(this.item?.order?.homeVisitDetails?.visitDate) || 'No especificada',
        verificationTime: this.item?.order?.homeVisitDetails?.visitTime || 'No especificada'
      };
    },

    // Mapear datos del solicitante
    applicantData() {
      return {
        businessName: this.item?.order?.applicantCompany?.companyName || 'No especificado',
        ruc: this.item?.order?.applicantCompany?.ruc || 'No especificado',
        requestDate: this.formatDate(this.item?.order?.requestDate) || 'No especificada',
        result: this.item?.finalResult || 'PENDIENTE'
      };
    },

    // Mapear datos del cliente
    customerData() {
      const client = this.item?.order?.client;
      return {
        fullName: client ? `${client.name || ''} ${client.lastName || ''}`.trim() : 'No especificado',
        interviewee: client ? `${client.name || ''} ${client.lastName || ''}`.trim() : 'No especificado',
        relationship: 'Titular', // Este valor no viene de la API, mantener como está
        documentType: client?.identityDocument?.documentType || 'No especificado',
        documentNumber: client?.identityDocument?.documentNumber || 'No especificado'
      };
    },

    // Mapear dirección del cliente
    customerAddress() {
      const location = this.item?.order?.client?.location;
      const dwelling = this.item?.order?.client?.dwelling;
      return {
        department: location?.department || 'No especificado',
        province: location?.province || 'No especificado',
        district: location?.district || 'No especificado',
        fullAddress: dwelling?.homeAddress || 'No especificada'
      };
    },

    // Mapear detalles de residencia
    residenceDetails() {
      const client = this.item?.order?.client;
      const residence = client?.residence;
      const dwelling = client?.dwelling;
      const zone = client?.zone;
      
      return {
        livesWith: residence?.livesWith || 'No especificado',
        resides: residence?.isResident ? 'Sí' : (residence?.isResident === false ? 'No' : 'No especificado'),
        residenceTime: residence?.time ? `${residence.time} ${residence.timeType || ''}` : 'No especificado',
        housingRented: client?.isTenant ? 'Alquilado' : 'Propio',
        housingType: dwelling?.dwellingType || 'No especificado',
        floorsQuantity: dwelling?.numberFloors || 'No especificado',
        floorLives: dwelling?.floorOccupied || 'No especificado',
        facadeColor: dwelling?.facadeColor || 'No especificado',
        material: dwelling?.dwellingMaterial || 'No especificado',
        state: dwelling?.dwellingCondition || 'No especificado',
        zone: zone?.zoneType || 'No especificado',
        housingStatus: dwelling?.typeFurnished || 'No especificado',
        roofType: dwelling?.roofType || 'No especificado',
        zoneCharacteristic: zone?.zoneCharacteristics?.join(', ') || 'No especificado',
        housingAccess: zone?.accessType || 'No especificado',
        zoneRisk: zone?.riskLevel || 'No especificado',
        garageIs: dwelling?.garage?.garageType || 'No especificado',
        garageDistance: dwelling?.garage?.distanceToDwelling || 'No especificado',
        realDirection: dwelling?.homeAddress || 'No especificada',
        familiarReferences: client?.contactReferences?.map(ref => ({
          name: ref.fullName || 'No especificado',
          contact: ref.phoneNumber || 'No especificado',
          relationship: ref.relation || 'No especificado'
        })) || []
      };
    },

    // Mapear datos del arrendador
    landlordData() {
      const landlord = this.item?.order?.client?.landlord;
      return {
        fullName: landlord?.fullName || 'No especificado',
        contactNumber: landlord?.phoneNumber || 'No especificado',
        documentNumber: 'No disponible en API',
        documentType: 'No disponible en API'
      };
    },

    // Mapear detalles de entrevista
    interviewDetails() {
      const interview = this.item?.order?.client?.landlord?.interviewDetails;
      const client = this.item?.order?.client;
      
      return {
        tenantName: interview?.clientNameAccordingToLandlord || (client ? `${client.name || ''} ${client.lastName || ''}`.trim() : 'No especificado'),
        ownHouse: this.item?.order?.client?.landlord?.ownHome ? 'Sí' : 'No',
        serviceClientPays: interview?.servicesPaidByClient?.join(', ') || 'No especificado',
        clientPaysPunctual: interview?.isTheClientPunctualWithPayments ? 'Sí' : (interview?.isTheClientPunctualWithPayments === false ? 'No' : 'No especificado'),
        clientRentalTime: interview?.time ? `${interview.time} ${interview.timeType || ''}` : 'No especificado',
        clientFloorNumber: interview?.floorOccupiedByClient || 'No especificado'
      };
    },

    // Mapear observaciones
    observationsData() {
      return {
        observations: this.item?.observations?.map(obs => obs.value) || []
      };
    },

    // Mapear resumen
    summaryData() {
      return {
        summary: this.item?.summary || 'No disponible'
      };
    },

    // Mapear glosario
    glossaryData() {
      return {
        glossaryItems: this.item?.glossary?.map(item => ({
          term: item.value?.split(':')[0]?.trim() || 'Término',
          definition: item.value?.split(':')[1]?.trim() || item.value || 'Definición no disponible'
        })) || []
      };
    },

    // Mapear casuística
    casuistryData() {
      return {
        casuistryItems: this.item?.casuistics?.map(item => {
          const parts = item.value?.split(':');
          return {
            title: parts?.[0]?.trim() || 'Casuística',
            description: parts?.[1]?.trim() || item.value || 'Descripción no disponible'
          };
        }) || []
      };
    },

    // ANEXO 01: Registro fotográfico del domicilio
    annexe01Data() {
      const documents = this.item?.order?.client?.documents;
      return {
        title: 'ANEXO 01: Registro fotográfico del domicilio',
        images: documents?.filter(doc => doc.type === 'FOTO_FACHADA_VIVIENDA')?.map(doc => ({
          src: doc.url,
          alt: `Registro fotográfico del domicilio`,
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 02: Registro fotográfico de alrededores
    annexe02Data() {
      const documents = this.item?.order?.client?.documents;
      return {
        title: 'ANEXO 02: Registro fotográfico de alrededores del domicilio',
        images: documents?.filter(doc => doc.type === 'FOTO_ALREDEDORES_VIVIENDA')?.map(doc => ({
          src: doc.url,
          alt: `Registro fotográfico de alrededores`,
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 03: Documentos de identidad del candidato
    annexe03Data() {
      const documents = this.item?.order?.client?.documents;
      return {
        title: 'ANEXO 03: Documentos de identidad del candidato',
        images: documents?.filter(doc => 
          doc.type === 'DNI' || 
          doc.type === 'CARNET_EXTRANJERIA' || 
          doc.type === 'PTP'
        )?.map(doc => ({
          src: doc.url,
          alt: 'Documento de identidad del candidato',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 04: Registro fotográfico de la cochera
    annexe04Data() {
      const documents = this.item?.order?.client?.documents;
      return {
        title: 'ANEXO 04: Registro fotográfico de la cochera',
        images: documents?.filter(doc => doc.type === 'FOTO_COCHERA')?.map(doc => ({
          src: doc.url,
          alt: 'Registro fotográfico de la cochera',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 05: Registro fotográfico de habitaciones
    annexe05Data() {
      const documents = this.item?.order?.client?.documents;
      return {
        title: 'ANEXO 05: Registro fotográfico de las habitaciones del domicilio',
        images: documents?.filter(doc => doc.type === 'FOTO_HABITACIONES')?.map(doc => ({
          src: doc.url,
          alt: 'Registro fotográfico de habitaciones',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 06: Recibos de servicios
    annexe06Data() {
      const documents = this.item?.order?.client?.documents;
      return {
        title: 'ANEXO 06: Recibos de servicios',
        images: documents?.filter(doc => 
          doc.type === 'RECIBO_AGUA' || 
          doc.type === 'RECIBO_LUZ'
        )?.map(doc => ({
          src: doc.url,
          alt: 'Recibo de servicios',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    }
  },

  data() {
    return {

      // Servicio para manejar reportes de verificación
      reportDetailsApiService: new ReportApiService('/reports'),

      // item de reporte de verificación
      item: null,
      
      // Estado de carga
      loading: false,
      
      // Progreso de carga
      loadingStep: 0,
      loadingSteps: [
        { icon: 'pi-file-o', label: 'Datos del reporte' },
        { icon: 'pi-users', label: 'Información del cliente' },
        { icon: 'pi-home', label: 'Detalles de la visita' }
      ],

      statusOptions: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'],

    }
  },



  methods : {

    // Función para obtener descripción amigable del tipo de documento
    getDocumentDescription(docType) {
      const descriptions = {
        'DNI': 'Documento Nacional de Identidad',
        'CARNET_EXTRANJERIA': 'Carnet de Extranjería',
        'PTP': 'Permiso Temporal de Permanencia',
        'RECIBO_AGUA': 'Recibo de Servicio de Agua',
        'RECIBO_LUZ': 'Recibo de Servicio de Luz',
        'FOTO_FACHADA_VIVIENDA': 'Fotografía de la fachada de la vivienda',
        'FOTO_ALREDEDORES_VIVIENDA': 'Fotografía de los alrededores de la vivienda',
        'FOTO_HABITACIONES': 'Fotografía de las habitaciones',
        'FOTO_COCHERA': 'Fotografía de la cochera'
      };
      return descriptions[docType] || `Documento tipo: ${docType}`;
    },

    // Función para formatear fechas en formato dd/mm/aaaa
    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        // Manejar diferentes formatos de fecha de entrada
        let dateToFormat;
        
        if (dateString.includes('T')) {
          // Si tiene formato ISO con hora, extraer solo la fecha
          const datePart = dateString.split('T')[0];
          const [year, month, day] = datePart.split('-');
          // Crear fecha usando componentes individuales para evitar zona horaria
          dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (dateString.includes('-')) {
          // Si es formato YYYY-MM-DD
          const [year, month, day] = dateString.split('-');
          dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          // Fallback para otros formatos
          dateToFormat = new Date(dateString);
        }
        
        // Verificar que la fecha sea válida
        if (isNaN(dateToFormat.getTime())) return dateString;
        
        // Formatear como dd/mm/aaaa usando los métodos locales
        const day = dateToFormat.getDate().toString().padStart(2, '0');
        const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
        const year = dateToFormat.getFullYear();
        
        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return dateString;
      }
    },

    // Función para enviar el reporte de verificación por correo electrónico
    onSendVerificationReportByEmail() {
      // Lógica para enviar el reporte por correo electrónico
    },

    // Función para descargar o imprimir el reporte de verificación en formato PDF
    onDownloadOrPrintVerificationReport() {
      // Lógica para descargar o imprimir el reporte en PDF
    },

    // Función para obtener el reporte de verificación por ID
    getVerificationReportById(reportId) {
      this.loading = true;
      this.loadingStep = 0;
      
      // Simular progreso de carga
      this.simulateLoadingProgress();

      this.reportDetailsApiService.getById(reportId).then(response => {
        this.item = response.data;
        console.log('Reporte de verificación obtenido:', this.item);

        // Completar todos los pasos
        this.loadingStep = this.loadingSteps.length;

        // Mostrar mensaje de éxito después de un breve delay
        setTimeout(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Datos cargados',
            detail: 'Reporte de verificación cargado correctamente',
            life: 3000
          });
        }, 300);
      })
          .catch(error => {
            console.error('Error al obtener el reporte de verificación:', error);
            
            // Mostrar mensaje de error
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo cargar el reporte de verificación',
              life: 5000
            });
            
            // Navegar de vuelta a la lista si no se puede cargar
            this.$router.push({ name: 'verification-reports' });
          })
          .finally(() => {
            this.loading = false;
          });
    },

    simulateLoadingProgress() {
      // Simular progreso paso a paso para mejor UX
      const progressInterval = setInterval(() => {
        if (this.loadingStep < this.loadingSteps.length - 1) {
          this.loadingStep++;
        } else {
          clearInterval(progressInterval);
        }
      }, 800); // Cambiar paso cada 800ms
      
      // Limpiar intervalo si la carga se completa antes
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 5000);
    }
  },

  created() {
    this.reportDetailsApiService = new ReportApiService('/reports');

    // Obtener ID desde params o query
    const reportId = this.$route.params.id || this.$route.query.id;
    
    if (reportId) {
      this.getVerificationReportById(reportId);
    } else {
      console.warn('No se proporcionó un ID de reporte en los parámetros de la ruta.');
      
      this.$toast.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se especificó un ID de reporte válido',
        life: 3000
      });
      
      // Navegar de vuelta a la lista
      this.$router.push({ name: 'verification-reports' });
    }
  }

};


</script>

<template>
  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto ">
  
    <!-- Indicador de carga minimalista -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <!-- Spinner elegante -->
        <pv-progress-spinner 
          size="48" 
          stroke-width="4" 
          animation-duration="1.2s" 
          class="loading-spinner"
        />
        
        <!-- Contenido textual simple -->
        <div class="loading-text">
          <h3 class="loading-title">Cargando reporte</h3>
          <p class="loading-subtitle">{{ loadingSteps[loadingStep]?.label || 'Preparando datos...' }}</p>
        </div>
      </div>
    </div>
    
    <!-- Contenido principal - solo se muestra cuando no está cargando y hay datos -->
    <template v-else-if="item">

    <!-- Breadcrumb -->
    <div class="text-base">
      <router-link
          :to="{ name: 'verification-reports' }"
          class="font-bold text-gray-900 no-underline hover:underline cursor-pointer"
      >
        Reportes de verificación
      </router-link>
      <span class="text-gray-500 font-bold"> / </span>
      <span class="text-blue-700 font-bold hover:underline cursor-pointer">
        detalle del reporte de verificación
      </span>
    </div>

    <!-- Número de orden a la izquierda y fecha de solicitud a la derecha -->
    <div class="flex align-content-center justify-content-between  mt-4 mb-2">
      <!-- Izquierda -->
      <h2 class="text-2xl xl:font-bold font-extrabold text-gray-900">
        Reporte:<span class="text-blue-700 xl:font-bold "> {{ item?.reportCode || 'Cargando...' }}</span>
      </h2>

      <!-- Derecha -->
      <span class="font-medium text-gray-900">
        Fecha de solicitud: {{ formatDate(item?.order?.requestDate) || 'Cargando...' }}
      </span>
    </div>

    <!-- botones para imprimir, descargar o enviar por correo el reporte de verificación -->
    <div class="flex align-content-center justify-content-end mb-2 gap-2">
      <!-- Botón para enviar por correo -->
      <pv-button
          class="p-button-email p-button p-button-sm"
          @click="onSendVerificationReportByEmail"
      >
        <i class="pi pi-envelope p-button-icon-left"></i>
        <span class="p-button-label">Enviar por correo</span>
      </pv-button>
      <!-- Botón imprimir en PDF -->
      <pv-button
          class=" p-button-print p-button p-button-sm"
          @click="onDownloadOrPrintVerificationReport"
      >
        <i class="pi pi-print p-button-icon-left"></i>
        <span class="p-button-label">Imprimir PDF</span>
      </pv-button>
      <!-- Botón para descargar en PDF -->
      <pv-button
          class="p-button-download p-button p-button-sm"
          @click="onDownloadOrPrintVerificationReport"
      >
        <i class="pi pi-download p-button-icon-left"></i>
        <span class="p-button-label">Descargar PDF</span>
      </pv-button>
    </div>

    <!-- Tarjetas de información del reporte de verificación -->
    <div class="flex flex-column pb-4 gap-4 mt-4">
      <!-- Primera sección: Detalles de la visita -->
      <VisitDetailsCard :item="visitDetails" />
      
      <!-- Segunda sección: Datos del solicitante y del cliente -->
      <div class="grid">
        <div class="col-12 lg:col-6">
          <ApplicantDataCard :item="applicantData" />
        </div>
        
        <div class="col-12 lg:col-6">
          <CustomerDataCard :item="customerData" />
        </div>
      </div>
      
      <!-- Tercera sección: Domicilio del cliente -->
      <CustomerAddressCard :item="customerAddress" />
      
      <!-- ============== SECCIÓN: Detalles de la entrevista con el cliente ============== -->
      <div class="section-separator">
        <h2 class="text-xl font-bold text-gray-800 py-2 border-bottom-1 surface-border mb-0">Detalles de la entrevista con el cliente</h2>
      </div>
      
      <!-- Cuarta sección: Detalles de residencia -->
      <ResidenceDetailsCard :item="residenceDetails" />
      
      <!-- ============== SECCIÓN: Detalles de la entrevista con el arrendador ============== -->
      <div class="section-separator">
        <h2 class="text-xl font-bold text-gray-800 py-2 border-bottom-1 surface-border mb-0">Detalles de la entrevista con el arrendador</h2>
      </div>
      
      <!-- Quinta sección: Datos del arrendador -->
      <LandlordDataCard :item="landlordData" />
      
      <!-- Sexta sección: Detalles de la entrevista -->
      <InterviewDetailsCard :item="interviewDetails" />
      
      <!-- ============== SECCIÓN: Observaciones, resumen, glosario y casuística ============== -->
      <div class="section-separator">
        <h2 class="text-xl font-bold text-gray-800 py-2 border-bottom-1 surface-border mb-0">Observaciones, resumen, glosario y casuística</h2>
      </div>
      
      <!-- Séptima sección: Observaciones -->
      <ObservationsCard :item="observationsData" />
      
      <!-- Octava sección: Resumen -->
      <ReportSummaryCard :item="summaryData" />
      
      <!-- Novena sección: Glosario -->
      <ReportGlossaryCard :item="glossaryData" />
      
      <!-- Décima sección: Casuística -->
      <CasuistryReportCard :item="casuistryData" />
      
      <!-- ============== SECCIÓN: ANEXOS ============== -->
      <div class="section-separator">
        <h2 class="text-xl font-bold text-gray-800 py-2 border-bottom-1 surface-border mb-0">ANEXOS</h2>
      </div>
      
      <!-- Undécima sección: ANEXO 01 - Registro fotográfico del domicilio -->
      <Annexe01DomicileCard :item="annexe01Data" />
      
      <!-- Duodécima sección: ANEXO 02 - Registro fotográfico de alrededores -->
      <Annexe02SurroundingsCard :item="annexe02Data" />
      
      <!-- Decimotercera sección: ANEXO 03 - Documentos de identidad del candidato -->
      <Annexe03CandidateCard :item="annexe03Data" />
      
      <!-- Decimocuarta sección: ANEXO 04 - Registro fotográfico de la cochera -->
      <Annexe04GarageLocationCard :item="annexe04Data" />
      
      <!-- Decimoquinta sección: ANEXO 05 - Registro fotográfico de habitaciones -->
      <Annexe05RoomsCard :item="annexe05Data" />
      
      <!-- Decimosexta sección: ANEXO 06 - Recibos de servicios -->
      <Annexe06DomicileLocationCard :item="annexe06Data" />
    </div>
    
    </template>
    
    <!-- Mensaje cuando no hay datos -->
    <div v-else class="flex justify-content-center align-items-center p-8">
      <div class="text-center">
        <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-3"></i>
        <h3 class="text-xl text-gray-700">No se encontró el reporte de verificación</h3>
        <p class="text-gray-500 mb-4">El reporte solicitado no existe o no se pudo cargar.</p>
        <pv-button 
          label="Volver a la lista" 
          icon="pi pi-arrow-left" 
          @click="$router.push({ name: 'verification-reports' })"
          class="p-button-outlined"
        />
      </div>
    </div>

  </div>



</template>

<style scoped>

/* Estilos del indicador de carga minimalista */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  background: #fafafa;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.loading-spinner {
  opacity: 0.8;
}

.loading-text {
  max-width: 300px;
}

.loading-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
  letter-spacing: -0.025em;
}

.loading-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  transition: opacity 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .loading-container {
    min-height: 40vh;
    margin: 0.5rem 0;
  }
  
  .loading-title {
    font-size: 1.125rem;
  }
  
  .loading-subtitle {
    font-size: 0.8125rem;
  }
}

/* Estilos personalizados para los botones */
/* Botón descargar en PDF */
.p-button-download {
  background-color: #7f8c8d !important; /* Verde */
  border-color: #7f8c8d !important;
}

.p-button-download:hover {
  background-color: #626f70 !important;  /* Verde oscuro */
  border-color: #626f70 !important;
}

/* Botón enviar por correo */
.p-button-email {
  background-color: #3498db !important;  /* Azul */
  border-color: #3498db !important;
}

.p-button-email:hover {
  background-color: #0b7dda !important; /* Azul oscuro */
  border-color: #0b7dda !important;
}

/* Botón imprimir en PDF */
.p-button-print {
  background-color: #27ae60 !important; /* Rojo */
  border-color: #27ae60 !important;
}
.p-button-print:hover {
  background-color: #1e8449 !important; /* Rojo oscuro */
  border-color: #1e8449 !important;
}

</style>