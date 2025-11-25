
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
import EmailSendComponent from '../components/email-send.component.vue'
import {ReportApiService} from "../services/reports-api.service.js";
import {EmailApiService} from "../services/email-api.service.js";
import {DownloadReportApiService} from "../services/download-report-api.service.js";
import {LandlordInterviewApiService} from "../services/landlord-interview-api.service.js";
import {Email} from "../models/email.entity.js";
import {DownloadReport} from "../models/download-report.entity.js";
import {NotificationMixin} from "../../../shared/utils/notification.utils.js";
import {VerifierApiService} from "../../verifier-management/services/verifier-api.service.js";

export default {
  name:'details-home-verification-report',

  mixins: [NotificationMixin],

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
    Annexe06DomicileLocationCard,
    EmailSendComponent
  },

  props: {
    item: {
      type: Object,
      required: false,
    },
  },

  computed: {
    // Get the effective item data (prioritize prop over internal data)
    effectiveItem() {
      return this.item || this.reportData;
    },

    // Mapear datos de detalles de visita
    visitDetails() {
      // Construir nombre completo del verificador si existe
      const verifierFullName = this.verifierData 
          ? `${this.verifierData.name || ''} ${this.verifierData.lastName || ''}`.trim()
          : null;
      
      return {
        verifier: verifierFullName || 
            this.effectiveItem?.order?.homeVisitDetails?.verifierName ||
            `Verificador ID: ${this.effectiveItem?.order?.homeVisitDetails?.verifierId}` || 'No especificado',
        googleMapsLink: this.effectiveItem?.order?.client?.location?.mapLocation || '#',
        verificationDate: this.formatDate(this.effectiveItem?.order?.homeVisitDetails?.visitDate) || 'No especificada',
        verificationTime: this.effectiveItem?.order?.homeVisitDetails?.visitTime || 'No especificada'
      };
    },

    // Mapear datos del solicitante
    canEditInterview() {
      const isTenant = this.effectiveItem?.order?.client?.isTenant === true;
      const finalResult = this.effectiveItem?.finalResult;
      
      // Permitir edición si:
      // 1. Es inquilino Y no hay resultado final, O
      // 2. El resultado final es ENTREVISTA_ARRENDADOR_FALTANTE
      return isTenant && (!finalResult || finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE');
    },

    isEditBlockedByFinalResult() {
      const finalResult = this.effectiveItem?.finalResult;
      // No bloquear si el resultado es ENTREVISTA_ARRENDADOR_FALTANTE
      return !!finalResult && finalResult !== 'ENTREVISTA_ARRENDADOR_FALTANTE';
    },

    applicantData() {
      return {
        businessName: this.effectiveItem?.order?.applicantCompany?.companyName || 'No especificado',
        ruc: this.effectiveItem?.order?.applicantCompany?.ruc || 'No especificado',
        requestDate: this.formatDate(this.effectiveItem?.order?.requestDate) || 'No especificada',
        executiveName: this.effectiveItem?.order?.applicantCompany?.executiveName || 'No especificado'
      };
    },

    // Mapear datos del cliente
    customerData() {
      const client = this.effectiveItem?.order?.client;
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
      const location = this.effectiveItem?.order?.client?.location;
      return {
        department: location?.department || 'No especificado',
        province: location?.province || 'No especificado',
        district: location?.district || 'No especificado',
        fullAddress: location?.homeAddress || 'No especificada'
      };
    },

    // Mapear detalles de residencia
    residenceDetails() {
      const client = this.effectiveItem?.order?.client;
      const residence = client?.residence;
      const dwelling = client?.dwelling;
      const zone = client?.zone;
      const location = client?.location;

      // Formatear el tipo de techo
      let roofTypeFormatted = 'No especificado';
      if (dwelling?.roofType) {
        if (dwelling.roofType === 'CASA_TECHADA') {
          roofTypeFormatted = 'TECHADA';
        } else if (dwelling.roofType === 'CASA_NO_TECHADA') {
          roofTypeFormatted = 'NO TECHADA';
        } else {
          roofTypeFormatted = dwelling.roofType;
        }
      }

      return {
        livesWith: residence?.livesWith || 'No especificado',
        resides: residence?.isResident ? 'Sí' : (residence?.isResident === false ? 'No' : 'No especificado'),
        residenceTime: client?.timeLivingText || (residence?.time ? `${residence.time} ${residence.timeType || ''}` : 'No especificado'),
        housingRented: client?.isTenant ? 'Alquilado' : 'Propio',
        housingType: dwelling?.dwellingType || 'No especificado',
        floorsQuantity: client?.apartmentInformation || 'No especificado',
        floorLives: dwelling?.floorOccupied || 'No especificado',
        facadeColor: dwelling?.facadeColor || 'No especificado',
        material: dwelling?.dwellingMaterial || 'No especificado',
        state: dwelling?.dwellingCondition || 'No especificado',
        zone: zone?.zoneType || 'No especificado',
        housingStatus: dwelling?.typeFurnished || 'No especificado',
        roofType: roofTypeFormatted,
        zoneCharacteristic: (Array.isArray(zone?.zoneCharacteristics) && zone.zoneCharacteristics.length > 0) 
          ? zone.zoneCharacteristics.join(', ') 
          : 'No especificado',
        housingAccess: zone?.accessType || 'No especificado',
        zoneRisk: (Array.isArray(client?.areaRisk) && client.areaRisk.length > 0)
          ? client.areaRisk.join(', ')
          : 'No especificado',
        garageIs: dwelling?.garage?.garageType || 'No especificado',
        garageDistance: dwelling?.garage?.distanceToDwelling || 'No especificado',
        realDirection: client?.exactClientAddress || location?.homeAddress || 'No especificada',
        familiarReferences: client?.contactReferences?.map(ref => ({
          name: ref.fullName || 'No especificado',
          contact: ref.phoneNumber || 'No especificado',
          relationship: ref.relation || 'No especificado'
        })) || []
      };
    },

    // Mapear datos del arrendador
    landlordData() {
      const landlord = this.effectiveItem?.order?.client?.landlord;
      return {
        fullName: landlord?.fullName || 'No especificado',
        contactNumber: landlord?.phoneNumber || 'No especificado',
        documentNumber: 'No disponible',
        documentType: 'No disponible'
      };
    },

    // Mapear detalles de entrevista
    interviewDetails() {
      const interview = this.effectiveItem?.order?.client?.landlord?.interviewDetails;
      const client = this.effectiveItem?.order?.client;

      // Formatear servicesPaidByClient - puede venir como string o array
      let servicesPaid = 'No especificado';
      if (interview?.servicesPaidByClient) {
        if (Array.isArray(interview.servicesPaidByClient)) {
          servicesPaid = interview.servicesPaidByClient.join(', ');
        } else if (typeof interview.servicesPaidByClient === 'string') {
          servicesPaid = interview.servicesPaidByClient;
        }
      }

      return {
        tenantName: interview?.clientNameAccordingToLandlord || (client ? `${client.name || ''} ${client.lastName || ''}`.trim() : 'No especificado'),
        ownHouse: this.effectiveItem?.order?.client?.landlord?.ownHome ? 'Sí' : 'No',
        serviceClientPays: servicesPaid,
        clientPaysPunctual: interview?.isTheClientPunctualWithPayments ? 'Sí' : (interview?.isTheClientPunctualWithPayments === false ? 'No' : 'No especificado'),
        clientRentalTime: interview?.timeLivingAccordingToLandlord || 'No especificado',
        clientFloorNumber: interview?.floorOccupiedByClient || 'No especificado'
      };
    },

    // Mapear observaciones
    observationsData() {
      return {
        observations: this.effectiveItem?.observations?.map(obs => obs.value) || []
      };
    },

    // Mapear resumen
    summaryData() {
      return {
        summary: this.effectiveItem?.summary || 'No disponible'
      };
    },

    // Mapear glosario
    glossaryData() {
      return {
        glossaryItems: this.effectiveItem?.glossary?.map(item => ({
          term: item.value?.split(':')[0]?.trim() || 'Término',
          definition: item.value?.split(':')[1]?.trim() || item.value || 'Definición no disponible'
        })) || []
      };
    },

    // Mapear casuística
    casuistryData() {
      return {
        casuistryItems: this.effectiveItem?.casuistics?.map(item => {
          const parts = item.value?.split(':');
          return {
            title: parts?.[0]?.trim() || 'Casuística',
            description: parts?.[1]?.trim() || item.value || 'Descripción no disponible'
          };
        }) || []
      };
    },

    // ANEXO 01: Registro fotográfico del candidato
    annexe01Data() {
      const documents = this.effectiveItem?.order?.client?.documents;
      return {
        title: 'ANEXO 01: Registro fotográfico del candidato',
        images: documents?.filter(doc => doc.type === 'ANEXO_1')?.map(doc => ({
          src: doc.url,
          alt: `Registro fotográfico del candidato`,
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 02: Registro fotográfico del domicilio
    annexe02Data() {
      const documents = this.effectiveItem?.order?.client?.documents;
      return {
        title: 'ANEXO 02: Registro fotográfico del domicilio',
        images: documents?.filter(doc => doc.type === 'ANEXO_2')?.map(doc => ({
          src: doc.url,
          alt: `Registro fotográfico del domicilio`,
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 03: Registro fotográfico de la cochera
    annexe03Data() {
      const documents = this.effectiveItem?.order?.client?.documents;
      return {
        title: 'ANEXO 03: Registro fotográfico de la cochera',
        images: documents?.filter(doc => doc.type === 'ANEXO_3')?.map(doc => ({
          src: doc.url,
          alt: 'Registro fotográfico de la cochera',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 04: Registro fotográfico de las habitaciones del domicilio
    annexe04Data() {
      const documents = this.effectiveItem?.order?.client?.documents;
      return {
        title: 'ANEXO 04: Registro fotográfico de las habitaciones del domicilio',
        images: documents?.filter(doc => doc.type === 'ANEXO_4')?.map(doc => ({
          src: doc.url,
          alt: 'Registro fotográfico de habitaciones',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 05: Registro fotográfico de alrededores del domicilio
    annexe05Data() {
      const documents = this.effectiveItem?.order?.client?.documents;
      return {
        title: 'ANEXO 05: Registro fotográfico de alrededores del domicilio',
        images: documents?.filter(doc => doc.type === 'ANEXO_5')?.map(doc => ({
          src: doc.url,
          alt: 'Registro fotográfico de alrededores',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    },

    // ANEXO 06: Foto datacrim
    annexe06Data() {
      const documents = this.effectiveItem?.order?.client?.documents;
      return {
        title: 'ANEXO 06: Foto datacrim',
        images: documents?.filter(doc => doc.type === 'ANEXO_6')?.map(doc => ({
          src: doc.url,
          alt: 'Foto datacrim',
          description: this.getDocumentDescription(doc.type),
          type: doc.type
        })) || []
      };
    }
  },

  data() {
    return {

      // Datos del reporte generado
      downloadReport: new DownloadReport({}),


      //Servicio para verificadores
      verifierApiService: new VerifierApiService('/verifiers'),

      // Servicio para manejar reportes de verificación
      reportDetailsApiService: new ReportApiService('/reports'),

      // Servicio para manejar envío de emails
      emailApiService: new EmailApiService('/emails'),

      // Servicio para manejar descarga de reportes en PDF
      downloadReportApiService: new DownloadReportApiService('/reports'),

      // Servicio para manejar entrevista con arrendador
      landlordInterviewApiService: new LandlordInterviewApiService('/orders'),

      // item de reporte de verificación
      reportData: null,

      // Datos del verificador
      verifierData: null,

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

      // Estado del diálogo de envío de correo
      emailDialogVisible: false,
      emailData: {
        recipientEmail: '',
        subject: '',
        message: ''
      },

    }
  },



  methods : {

    // Función para obtener descripción amigable del tipo de documento
    getDocumentDescription(docType) {
      const descriptions = {
        'ANEXO_1': 'Fotografía del candidato',
        'ANEXO_2': 'Fotografía del domicilio',
        'ANEXO_3': 'Fotografía de la cochera',
        'ANEXO_4': 'Fotografía de las habitaciones',
        'ANEXO_5': 'Fotografía de los alrededores del domicilio',
        'ANEXO_6': 'Fotografía datacrim',
        'DOCUMENTO_IDENTIDAD': 'Documento de identidad',
        'FOTO_FACHADA_VIVIENDA': 'Fotografía de la fachada de la vivienda',
        'RECIBO_SERVICIO': 'Recibo de servicio (agua/luz)'
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

    // Función para abrir el diálogo de envío de correo electrónico
    onSendVerificationReportByEmail() {
      // Configurar datos predeterminados del email
      const client = this.effectiveItem?.order?.client;
      const clientName = client ? `${client.name || ''} ${client.lastName || ''}`.trim() : 'Cliente';
      const reportCode = this.effectiveItem?.reportCode || 'N/A';
      const applicantEmail = this.effectiveItem?.order?.applicantCompany?.email || '';

      this.emailData = {
        recipientEmail: applicantEmail,
        subject: `Reporte de Verificación Domiciliaria - ${reportCode} - ${clientName}`,
        message: `Estimado(a),\n\nAdjunto encontrará el reporte de verificación domiciliaria solicitado.\n\nCódigo de reporte: ${reportCode}\nCliente: ${clientName}\n\nSaludos cordiales.`
      };

      this.emailDialogVisible = true;
    },

    // Función para manejar el envío del correo desde el diálogo
    onEmailSendRequested(emailEntity) {
      // Validar que tenemos un reporte válido
      if (!this.effectiveItem || !this.effectiveItem.id) {
        this.showToast({
          severity: 'warn',
          summary: 'Reporte no disponible',
          detail: 'No se puede enviar el correo porque el reporte no está cargado. Por favor, recargue la página e intente nuevamente.',
          life: 4000
        });
        return;
      }

      // Crear objeto Email con todos los datos necesarios
      const emailData = new Email({
        from: 'noreply@trackermobility.com', // Email del sistema
        to: emailEntity.recipientEmail,
        subject: emailEntity.subject,
        body: emailEntity.message || '',
        reportId: this.effectiveItem.id
      });

      // Mostrar mensaje de progreso
      this.showToast({
        severity: 'info',
        summary: 'Enviando correo',
        detail: 'Estamos enviando el reporte. Esto puede tomar unos segundos.',
        life: 3000
      });

      // Enviar el correo
      this.emailApiService.sendEmail(emailData)
          .then(response => {
            console.log('Correo enviado exitosamente:', response.data);

            this.showToast({
              severity: 'success',
              summary: 'Correo enviado exitosamente',
              detail: `El reporte ha sido enviado a ${emailEntity.recipientEmail}. El destinatario recibirá el documento PDF adjunto.`,
              life: 5000
            });

            this.emailDialogVisible = false;
          })
          .catch(error => {
            console.error('Error al enviar el correo:', error);

            // Procesar el error para mostrar un mensaje amigable
            const errorMessage = this.getEmailErrorMessage(error);

            this.showToast({
              severity: 'error',
              summary: 'No se pudo enviar el correo',
              detail: errorMessage,
              life: 6000
            });
          });
    },

    // Función para traducir errores técnicos a mensajes amigables
    getEmailErrorMessage(error) {
      // Obtener el mensaje de error del backend
      const backendMessage = error.response?.data?.message || error.message || '';
      const statusCode = error.response?.status;

      // Errores específicos de Elastic Email o servicios de correo
      if (backendMessage.includes('testing purposes') || backendMessage.includes('register your')) {
        return 'El servicio de correo está en modo de prueba. Por favor, contacte al administrador del sistema para activar el envío a múltiples destinatarios.';
      }

      if (backendMessage.includes('Invalid email') || backendMessage.includes('invalid recipient')) {
        return 'La dirección de correo del destinatario no es válida. Por favor, verifique el correo e intente nuevamente.';
      }

      if (backendMessage.includes('Authentication failed') || backendMessage.includes('API key')) {
        return 'Error de autenticación con el servicio de correo. Por favor, contacte al administrador del sistema.';
      }

      if (backendMessage.includes('quota') || backendMessage.includes('limit exceeded')) {
        return 'Se ha alcanzado el límite de correos enviados. Por favor, intente más tarde o contacte al administrador.';
      }

      if (backendMessage.includes('connection') || backendMessage.includes('timeout')) {
        return 'No se pudo conectar con el servidor de correo. Por favor, verifique su conexión a internet e intente nuevamente.';
      }

      if (backendMessage.includes('attachment') || backendMessage.includes('file')) {
        return 'Error al adjuntar el archivo PDF. Por favor, verifique que el reporte exista e intente nuevamente.';
      }

      // Errores por código de estado HTTP
      switch (statusCode) {
        case 400:
          return 'Los datos del correo no son válidos. Por favor, verifique el destinatario y el contenido del mensaje.';
        case 401:
          return 'No tiene autorización para enviar correos. Por favor, contacte al administrador del sistema.';
        case 403:
          return 'No tiene permisos suficientes para enviar este correo. Contacte al administrador.';
        case 404:
          return 'No se encontró el reporte solicitado. Por favor, recargue la página e intente nuevamente.';
        case 500:
          return 'Error interno del servidor. Por favor, intente nuevamente en unos momentos.';
        case 503:
          return 'El servicio de correo no está disponible temporalmente. Por favor, intente más tarde.';
        default:
          break;
      }

      // Mensaje genérico si no se identifica el error
      return 'No se pudo enviar el correo electrónico. Por favor, verifique los datos e intente nuevamente. Si el problema persiste, contacte al administrador.';
    },

    // Función para cancelar el envío de correo
    onEmailCancelRequested() {
      this.emailDialogVisible = false;
    },

    // Función para descargar o imprimir el reporte de verificación en formato PDF
    onDownloadOrPrintVerificationReport() {
      // Validar que tenemos un reporte válido
      if (!this.effectiveItem || !this.effectiveItem.id) {
        this.showToast({
          severity: 'warn',
          summary: 'Reporte no disponible',
          detail: 'No se puede descargar el reporte porque no está cargado. Por favor, recargue la página e intente nuevamente.',
          life: 4000
        });
        return;
      }

      // Mostrar mensaje de preparación
      this.showToast({
        severity: 'info',
        summary: 'Preparando descarga',
        detail: 'Estamos preparando su documento...',
        life: 3000
      });

      // Obtener el ID del reporte
      const reportId = this.effectiveItem.id;

      // Obtener la URL de descarga del reporte
      this.downloadReportApiService.getReportDownloadUrl(reportId)
          .then(response => {
            console.log('Respuesta del servidor:', response.data);

            // Crear instancia del modelo con los datos recibidos
            this.downloadReport = new DownloadReport(response.data);

            // Verificar que se recibió una URL válida
            if (!this.downloadReport.reportUrl) {
              throw new Error('El servidor no proporcionó una URL de descarga válida');
            }

            // Abrir el PDF en una nueva pestaña del navegador
            window.open(this.downloadReport.reportUrl, '_blank');

            // Mostrar mensaje de éxito
            this.showToast({
              severity: 'success',
              summary: 'Documento descargado',
              detail: 'El reporte se ha abierto correctamente.',
              life: 3000
            });

            console.log('URL del reporte:', this.downloadReport.reportUrl);
          })
          .catch(error => {
            console.error('Error al obtener el reporte:', error);

            // Procesar el error para mostrar un mensaje amigable
            const errorMessage = this.getDownloadErrorMessage(error);

            this.showToast({
              severity: 'error',
              summary: 'Error al descargar',
              detail: errorMessage,
              life: 6000
            });
          });
    },

    // Función para traducir errores de descarga a mensajes amigables
    getDownloadErrorMessage(error) {
      const backendMessage = error.response?.data?.message || error.message || '';
      const statusCode = error.response?.status;

      // Errores específicos
      if (backendMessage.includes('not found') || statusCode === 404) {
        return 'El reporte solicitado no existe. Por favor, verifique que el reporte esté guardado correctamente.';
      }

      if (backendMessage.includes('template') || backendMessage.includes('generate')) {
        return 'Error al generar el documento PDF. Por favor, verifique que todos los datos del reporte estén completos.';
      }

      if (backendMessage.includes('timeout')) {
        return 'El tiempo de espera se agotó al generar el documento. Por favor, intente nuevamente.';
      }

      // Errores por código HTTP
      switch (statusCode) {
        case 400:
          return 'Los datos del reporte no son válidos para generar el PDF. Por favor, verifique la información del reporte.';
        case 401:
          return 'No tiene autorización para descargar este reporte. Por favor, contacte al administrador.';
        case 403:
          return 'No tiene permisos suficientes para descargar este reporte. Contacte al administrador.';
        case 500:
          return 'Error interno del servidor al generar el PDF. Por favor, intente nuevamente en unos momentos.';
        case 503:
          return 'El servicio de generación de PDF no está disponible temporalmente. Por favor, intente más tarde.';
        default:
          break;
      }

      // Mensaje genérico
      return 'No se pudo generar el reporte PDF. Por favor, intente nuevamente. Si el problema persiste, contacte al administrador.';
    },

    // Función para obtener el reporte de verificación por ID
    getVerificationReportById(reportId) {
      this.loading = true;
      this.loadingStep = 0;

      // Simular progreso de carga
      this.simulateLoadingProgress();

      this.reportDetailsApiService.getById(reportId).then(response => {
        this.reportData = response.data;
        console.log('Reporte de verificación obtenido:', this.reportData);

        // Obtener datos del verificador si existe el ID
        const verifierId = this.reportData?.order?.homeVisitDetails?.verifierId;
        if (verifierId) {
          this.getVerifierById(verifierId);
        }

        // Completar todos los pasos
        this.loadingStep = this.loadingSteps.length;

        // Mostrar mensaje de éxito después de un breve delay
        setTimeout(() => {
          this.showToast({
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
            this.showToast({
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

    // Función para obtener los datos del verificador por ID
    getVerifierById(verifierId) {
      this.verifierApiService.getById(verifierId)
          .then(response => {
            this.verifierData = response.data;
            console.log('Datos del verificador obtenidos:', this.verifierData);
          })
          .catch(error => {
            console.error('Error al obtener datos del verificador:', error);
            // No mostramos error al usuario, simplemente usaremos el fallback
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
    },

    // Actualizar entrevista con arrendador (view + backend API)
    async onUpdateInterviewDetailsRequested(payload) {

      
      try {

        // Mostrar indicador de carga
        this.loading = true;

        // Función para convertir valores a booleano o null
        const toBoolOrNull = (v) => {
          if (v === null || v === undefined || v === '' || v === 'No especifica') return null;
          if (v === 'Sí' || v === true || v === 'true') return true;
          if (v === 'No' || v === false || v === 'false') return false;
          // Cualquier otro valor que no sea explícitamente Sí o No se considera null
          return null;
        };
        
        // Construir el payload según el formato del endpoint
        const apiPayload = {
          ownHome: toBoolOrNull(payload?.ownHouse),
          clientNameAccordingToLandlord: payload?.tenantName || '',
          servicesPaidByClient: payload?.serviceClientPays || '',
          isTheClientPunctualWithPayments: toBoolOrNull(payload?.clientPaysPunctual),
          timeLivingAccordingToLandlord: payload?.clientRentalTime || '',
          floorOccupiedByClient: payload?.clientFloorNumber || ''
        };

        // Obtener el orderId desde el reporte
        const orderId = this.effectiveItem?.order?.id;

        if (!orderId) {
          console.error('❌ ERROR: No se encontró el Order ID');
          throw new Error('No se pudo obtener el ID de la orden');
        }

        console.log('📡 Enviando petición al backend...');
        console.log(`   Endpoint: /orders/${orderId}/landlord-interview`);
        
        // Enviar actualización al backend
        const response = await this.landlordInterviewApiService.sendLandlordInterview(orderId, apiPayload);

        console.log('🔄 Actualizando estado local...');
        // Actualizar estado local de la vista para reflejar cambios inmediatamente
        if (!this.reportData) this.reportData = {};
        if (!this.reportData.order) this.reportData.order = {};
        if (!this.reportData.order.client) this.reportData.order.client = {};
        if (!this.reportData.order.client.landlord) this.reportData.order.client.landlord = {};

        this.reportData.order.client.landlord.ownHome = apiPayload.ownHome;
        this.reportData.order.client.landlord.interviewDetails = {
          ...(this.reportData.order.client.landlord.interviewDetails || {}),
          clientNameAccordingToLandlord: apiPayload.clientNameAccordingToLandlord,
          servicesPaidByClient: apiPayload.servicesPaidByClient.split(',').map(s => s.trim()).filter(Boolean),
          isTheClientPunctualWithPayments: apiPayload.isTheClientPunctualWithPayments,
          time: apiPayload.timeLivingAccordingToLandlord,
          timeType: '',
          floorOccupiedByClient: apiPayload.floorOccupiedByClient
        };

        console.log('💾 Estado local actualizado correctamente');
        console.log('✅ Proceso completado exitosamente');

        this.showToast({
          severity: 'success',
          summary: 'Guardado exitosamente',
          detail: 'Los datos de la entrevista con el arrendador se actualizaron correctamente.',
          life: 3000
        });
      } catch (error) {
        console.error('Error completo:', error);
        console.error('Tipo de error:', error?.constructor?.name);
        
        if (error?.response) {
          console.error('📡 Respuesta del servidor:');
          console.error('  - Status:', error.response.status);
          console.error('  - Status Text:', error.response.statusText);
          console.error('  - Data:', error.response.data);
          console.error('  - Headers:', error.response.headers);
        }
        
        if (error?.request) {
          console.error('📤 Request realizado:', error.request);
        }
        
        console.error('💬 Mensaje de error:', error?.message);
        console.error('📚 Stack trace:', error?.stack);
        
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            'No se pudo actualizar la entrevista con el arrendador.';
        
        console.error('🔔 Mensaje mostrado al usuario:', errorMessage);
        
        this.showToast({
          severity: 'error',
          summary: 'Error al guardar',
          detail: errorMessage,
          life: 5000
        });
      } finally {
        this.loading = false;
      }
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

      this.showToast({
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
    <template v-else-if="effectiveItem">

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
          Reporte:<span class="text-blue-700 xl:font-bold "> {{ effectiveItem?.reportCode || 'Cargando...' }}</span>
        </h2>

        <!-- Derecha -->
        <span class="font-medium text-gray-900">
        Fecha de solicitud: {{ formatDate(effectiveItem?.order?.requestDate) || 'Cargando...' }}
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
        <!--
        <pv-button
            class=" p-button-print p-button p-button-sm"
            @click="onDownloadOrPrintVerificationReport"
        >
          <i class="pi pi-print p-button-icon-left"></i>
          <span class="p-button-label">Imprimir PDF</span>
        </pv-button>
        -->
        
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
        <VisitDetailsCard :item="visitDetails" :result="effectiveItem?.finalResult || 'PENDIENTE'"/>

        <!-- Segunda sección: Datos del solicitante (ocupa todo el ancho) -->
        <ApplicantDataCard :item="applicantData" />

        <!-- Tercera sección: Datos del cliente y Domicilio del cliente (lado a lado) -->
        <div class="grid">
          <div class="col-12 lg:col-6">
            <CustomerDataCard :item="customerData" />
          </div>

          <div class="col-12 lg:col-6">
            <CustomerAddressCard :item="customerAddress" />
          </div>
        </div>

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
        <InterviewDetailsCard
          :item="interviewDetails"
          :can-edit="canEditInterview"
          :blocked-by-final-result="isEditBlockedByFinalResult"
          @update-interview-details-requested="onUpdateInterviewDetailsRequested"
        />

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

    <!-- Diálogo para envío de correo electrónico -->
    <email-send-component
        :visible="emailDialogVisible"
        :recipient-email="emailData.recipientEmail"
        :subject="emailData.subject"
        :message="emailData.message"
        :report-code="effectiveItem?.reportCode || 'N/A'"
        @save-requested="onEmailSendRequested"
        @cancel-requested="onEmailCancelRequested"
    />

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