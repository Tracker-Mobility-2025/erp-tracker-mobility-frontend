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

  data() {
    return {
      statusOptions: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'],
      
      // Datos de ejemplo para las tarjetas
      visitDetails: {
        verifier: 'Janover Gonzalo Saldaña Vela',
        googleMapsLink: 'https://maps.app.goo.gl/WQpZ2SPsPAinAovTA',
        verificationDate: '10/09/2025'
      },
      
      applicantData: {
        businessName: 'MOTOS MILLENNIUM SAC',
        ruc: '20605680446',
        requestDate: '20/08/2025',
        result: 'OBSERVADO'
      },
      
      customerData: {
        fullName: 'Alfonso Eloy Sanchez Vela',
        interviewee: 'Alfonso Eloy Sanchez Vela',
        relationship: 'Titular',
        documentType: 'CE',
        documentNumber: '007943592'
      },
      
      customerAddress: {
        department: 'Lima',
        province: 'Lima',
        district: 'Santa Anita',
        fullAddress: 'Asociación la pradera de Santa Anita - ref. Reparto mz k lt 46 - Santa Anita'
      },
      
      residenceDetails: {
        livesWith: 'Vive con su pareja e hijos',
        resides: 'Sí',
        residenceTime: '5 años',
        housingRented: 'Alquilado',
        housingType: 'Departamento',
        floorsQuantity: '5 pisos',
        floorLives: '5 piso',
        facadeColor: 'Verde',
        material: 'Noble',
        state: 'Bueno',
        zone: 'Urbana',
        housingStatus: 'Amoblada',
        roofType: 'Techada',
        zoneCharacteristic: 'Vigilada',
        housingAccess: 'Fácil',
        zoneRisk: 'Ninguna',
        garageIs: 'Alquilado',
        garageDistance: 'Ubicada dentro de la vivienda',
        realDirection: 'Calle 27 las praderas Mz K Lote 46 Santa Anita',
        familiarReferences: [
          { name: 'Lucila', contact: '999 666 777', relationship: 'Arrendador' },
          { name: 'Meleni', contact: '999 666 777', relationship: 'Esposa' },
          { name: 'José', contact: '999 666 777', relationship: 'Primo' }
        ]
      },
      
      landlordData: {
        fullName: 'Janover Gonzalo Saldaña Vela',
        contactNumber: '999 777 666',
        documentNumber: '007943592',
        documentType: 'CE'
      },
      
      interviewDetails: {
        tenantName: 'Alfonso Eloy Sanchez Vela',
        ownHouse: '-',
        serviceClientPays: '-',
        clientPaysPunctual: '-',
        clientRentalTime: '-',
        clientFloorNumber: '-'
      },
      
      observationsData: {
        observations: [
          'EL CLIENTE DIO COMO REFERENCIA A LA SEÑORA LUCILA, QUIEN EN LA ENTREVISTA DUO QUE ES LA SUEGRA Y QUE SOLO ES INQUILINA, NO LA DUEÑA DEL LUGAR. POR ESO, NO SE PUDO CONTACTAR A LA TITULAR PARA ASEGURAR LA RESIDENCIA EN LA DIRECCIÓN MENCIONADA.',
          'EL LUGAR QUE EL CLIENTE SEÑALA PARA LA COCHERA ES UN PASILLO POR DONDE PASAN LAS PERSONAS. CABE RESALTAR QUE HAY UN DEPARTAMENTO EN LA PARTE DE ATRÁS, LO QUE DIFICULTA EL PASO.'
        ]
      },
      
      summaryData: {
        summary: 'EL CLIENTE VIVE CON SU PAREJA E HIJO EN UNA CASA ALQUILADA UBICADA EN CALLE 27 LAS PRADERAS MZ K LOTE 46 SANTA ANITA. LA COCHERA ESTÁ DENTRO DE LA MISMA PROPIEDAD. COMO REFERENCIA, EL CLIENTE PROPORCIONÓ EL NÚMERO DE TELÉFONO DE SU FAMILIAR (SUEGRA) LUCILA 914011796 QUIEN INDICÓ SER UNA INQUILINA NO SE PUDO CONTACTAR CON EL TITULAR DEL PREDIO LA ZONA ES SEGURA – DATACRIM.'
      },
      
      glossaryData: {
        glossaryItems: [
          {
            term: 'SE TRANSITA CON CAUTELA',
            definition: 'IMPLICA QUE SE DEBE PROCEDER CON CUIDADO Y ATENCIÓN AL MOVERSE O ACTUAR EN UNA DETERMINADA ÁREA O SITUACIÓN.'
          },
          {
            term: 'PRESENCIA - DELINCUENCIAL',
            definition: 'INDICA LA EXISTENCIA DE ACTIVIDAD CRIMINAL O LA PRESENCIA DE PERSONAS INVOLUCRADAS EN ACTIVIDADES DELICTIVAS EN EL ÁREA EN CUESTIÓN.'
          },
          {
            term: 'ZONA PELIGROSA',
            definition: 'SEÑALA UN LUGAR CON UN NIVEL DE RIESGO SIGNIFICATIVO, DONDE PUEDEN OCURRIR EVENTOS O SITUACIONES QUE REPRESENTAN AMENAZAS PARA LA SEGURIDAD.'
          }
        ]
      },
      
      casuistryData: {
        casuistryItems: [
          {
            title: 'Dificultades de comunicación con el arrendador',
            description: 'no se ha logrado establecer comunicación con el dueño de la vivienda donde el cliente alquila, lo que impide la verificación de información clave sobre las condiciones de arrendamiento y la relación con el propietario.'
          }
        ]
      },
      
      annexe01Data: {
        title: 'ANEXO 01: Registro fotográfico del domicilio',
        images: [
          {
            src: 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Domicilio+Principal',
            alt: 'Registro fotográfico del domicilio',
            description: 'Vista frontal del domicilio'
          }
        ]
      },
      
      annexe02Data: {
        title: 'ANEXO 02: Registro fotográfico de alrededores del domicilio',
        images: [
          {
            src: 'https://via.placeholder.com/400x300/059669/ffffff?text=Alrededores+1',
            alt: 'Registro fotográfico de alrededores - Vista 1',
            description: 'Vista lateral izquierda del domicilio'
          },
          {
            src: 'https://via.placeholder.com/400x300/059669/ffffff?text=Alrededores+2',
            alt: 'Registro fotográfico de alrededores - Vista 2',
            description: 'Vista frontal de los alrededores'
          },
          {
            src: 'https://via.placeholder.com/400x300/059669/ffffff?text=Alrededores+3',
            alt: 'Registro fotográfico de alrededores - Vista 3',
            description: 'Vista lateral derecha del domicilio'
          }
        ]
      },
      
      annexe03Data: {
        title: 'ANEXO 03: Registro fotográfico del candidato',
        images: [
          {
            src: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Foto+Candidato',
            alt: 'Fotografía del candidato',
            description: 'Foto del candidato en el domicilio'
          },
          {
            src: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Documento+1',
            alt: 'Documento de identidad del candidato - Parte 1',
            description: 'Documento de identidad - Anverso'
          },
          {
            src: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Documento+2',
            alt: 'Documento de identidad del candidato - Parte 2',
            description: 'Documento de identidad - Reverso'
          }
        ]
      },
      
      annexe04Data: {
        title: 'ANEXO 04: Ubicación de la cochera',
        images: [
          {
            src: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Ubicación+Cochera',
            alt: 'Ubicación de la cochera',
            description: 'Vista de la cochera y motocicletas'
          }
        ]
      },
      
      annexe05Data: {
        title: 'ANEXO 05: Registro fotográfico de las habitaciones del domicilio',
        images: [
          {
            src: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Habitación+1',
            alt: 'Registro fotográfico de habitación - Cocina',
            description: 'Vista de la cocina del domicilio'
          },
          {
            src: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Habitación+2',
            alt: 'Registro fotográfico de habitación - Sala',
            description: 'Vista de la sala del domicilio'
          }
        ]
      },
      
      annexe06Data: {
        title: 'ANEXO 06: Ubicación del domicilio',
        images: [
          {
            src: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Mapa+Ubicación',
            alt: 'Ubicación del domicilio en mapa',
            description: 'Mapa con la ubicación exacta del domicilio'
          }
        ]
      }
    }
  },

  methods : {

    // Función para enviar el reporte de verificación por correo electrónico
    onSendVerificationReportByEmail() {
      // Lógica para enviar el reporte por correo electrónico
    },

    // Función para descargar o imprimir el reporte de verificación en formato PDF
    onDownloadOrPrintVerificationReport() {
      // Lógica para descargar o imprimir el reporte en PDF
    }

  }

};


</script>

<template>
  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto " >

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
        Reporte:<span class="text-blue-700 xl:font-bold "> REP-2025-001</span>
      </h2>

      <!-- Derecha -->
      <span class="font-medium text-gray-900">
        Fecha de solicitud: 10/09/2025
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
      
      <!-- Decimotercera sección: ANEXO 03 - Registro fotográfico del candidato -->
      <Annexe03CandidateCard :item="annexe03Data" />
      
      <!-- Decimocuarta sección: ANEXO 04 - Ubicación de la cochera -->
      <Annexe04GarageLocationCard :item="annexe04Data" />
      
      <!-- Decimoquinta sección: ANEXO 05 - Registro fotográfico de habitaciones -->
      <Annexe05RoomsCard :item="annexe05Data" />
      
      <!-- Decimosexta sección: ANEXO 06 - Ubicación del domicilio -->
      <Annexe06DomicileLocationCard :item="annexe06Data" />
    </div>

  </div>



</template>

<style scoped>

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