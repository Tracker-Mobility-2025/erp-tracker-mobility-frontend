<script>
import {NotificationMixin} from "../../../shared/utils/notification.utils.js";

// Constantes de configuración
const ALLOWED_DOCUMENT_TYPES = ['FOTO_FACHADA_VIVIENDA', 'RECIBO_SERVICIO', 'DOCUMENTO_IDENTIDAD'];
const DOCUMENT_TYPE_LABELS = {
  'FOTO_FACHADA_VIVIENDA': 'FACHADA DE VIVIENDA',
  'RECIBO_SERVICIO': 'RECIBO DE SERVICIO',
  'DOCUMENTO_IDENTIDAD': 'DOC DE IDENTIDAD'
};
const DOCUMENT_TYPE_MAP = {
  'DNI': 'DNI',
  'CARNET_EXTRANJERIA': 'CE',
  'PTP': 'PTP'
};
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
const FILE_ICONS = {
  'pdf': 'pi-file-pdf',
  'doc': 'pi-file-word',
  'docx': 'pi-file-word',
  'xls': 'pi-file-excel',
  'xlsx': 'pi-file-excel',
  'txt': 'pi-file',
  'jpg': 'pi-image',
  'jpeg': 'pi-image',
  'png': 'pi-image',
  'gif': 'pi-image',
  'bmp': 'pi-image',
  'webp': 'pi-image'
};
const FILE_COLORS = {
  'pdf': 'text-red-500',
  'doc': 'text-blue-500',
  'docx': 'text-blue-500',
  'xls': 'text-green-500',
  'xlsx': 'text-green-500',
  'txt': 'text-gray-500',
  'jpg': 'text-purple-500',
  'jpeg': 'text-purple-500',
  'png': 'text-purple-500',
  'gif': 'text-purple-500',
  'bmp': 'text-purple-500',
  'webp': 'text-purple-500'
};

export default {
  name: 'order-description',
  
  mixins: [NotificationMixin],

  props : {
    item: {
      type: Object,
      required: true
    }
  },

  emits: ['downloadDocument'],

  data() {
    return {
      showDocumentModal: false,
      selectedDocument: null,
      imageZoom: 1,
      showDocumentContent: false
    }
  },

  computed: {
    // Filtrar y mapear documentos según los tipos permitidos
    filteredDocuments() {
      if (!this.item?.client?.documents) return [];
      return this.item.client.documents
        .filter(doc => ALLOWED_DOCUMENT_TYPES.includes(doc.type))
        .map(doc => ({
          ...doc,
          displayName: DOCUMENT_TYPE_LABELS[doc.type] || doc.type
        }));
    }
  },

  methods: {
    formatPhoneNumber(phoneNumber) {
      if (!phoneNumber) return 'No disponible';
      const cleanNumber = String(phoneNumber).replace(/\D/g, '');
      return cleanNumber.replace(/(\d{3})(?=\d)/g, '$1 ');
    },

    formatDocumentType(documentType) {
      return documentType ? (DOCUMENT_TYPE_MAP[documentType] || documentType) : 'No disponible';
    },

    async downloadDocument(type, document = null) {
      try {
        if (!document?.url) {
          console.warn('No se puede descargar el documento: URL no válida');
          return;
        }

        console.log('Iniciando descarga de:', document.url);
        this.showToast({
          severity: 'info',
          summary: 'Descargando...',
          detail: 'Preparando la descarga del documento'
        });

        this.$emit('download-document', { type, item: this.item, document });
        await this.performDownload(document.url, this.generateFileName(type, document));
        console.log('Documento descargado correctamente');

      } catch (error) {
        console.error('Error al descargar documento:', error);
        this.showToast({
          severity: 'error',
          summary: 'Error de descarga',
          detail: 'No se pudo descargar el documento. Intente nuevamente.'
        });
      }
    },

    async performDownload(url, filename) {
      try {
        if (this.isImageFile(url)) {
          console.log('Descargando imagen:', url);
          await this.downloadImageWithCanvas(url, filename);
          return;
        }

        console.log('Descargando archivo con fetch:', url);
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const blob = await response.blob();
        this.downloadBlob(blob, filename);
      } catch (error) {
        console.warn('Descarga con fetch falló, usando método alternativo:', error);
        this.downloadWithLink(url, filename);
      }
    },

    async downloadImageWithCanvas(url, filename) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            // Crear canvas del tamaño de la imagen
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Dibujar la imagen en el canvas
            ctx.drawImage(img, 0, 0);
            
            // Convertir canvas a blob y descargar
            canvas.toBlob((blob) => {
              if (blob) {
                console.log('Imagen convertida a blob con canvas, tamaño:', blob.size);
                this.downloadBlob(blob, filename);
                resolve();
              } else {
                reject(new Error('No se pudo convertir imagen a blob'));
              }
            }, 'image/png', 1.0);
            
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => {
          reject(new Error('Error al cargar imagen para canvas'));
        };
        
        // Intentar cargar la imagen
        img.src = url;
      });
    },

    downloadBlob(blob, filename) {
      try {
        // Crear URL temporal para el blob
        const url = window.URL.createObjectURL(blob);
        console.log('URL del blob creada:', url);
        
        // Crear elemento de enlace temporal
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        // Agregar al DOM temporalmente y hacer click
        document.body.appendChild(link);
        
        // Simular click para iniciar descarga
        link.click();
        
        console.log('Descarga iniciada para:', filename);
        
        // Limpiar después de un breve delay
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log('Recursos de descarga limpiados');
        }, 100);
        
      } catch (error) {
        console.error('Error en downloadBlob:', error);
        throw error;
      }
    },

    downloadWithLink(url, filename) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'documento';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    },

    generateFileName(type, document) {
      const timestamp = new Date().toISOString().slice(0, 10);
      const docLabel = this.getDocumentLabel(type).replace(/[^a-zA-Z0-9]/g, '_');
      const extension = this.getFileExtension(document.url) || 'file';
      return `${docLabel}_${timestamp}.${extension}`;
    },

    viewDocument(document) {
      this.selectedDocument = document;
      this.imageZoom = 1;
      this.showDocumentModal = true;
    },

    closeModal() {
      Object.assign(this, {
        showDocumentModal: false,
        selectedDocument: null,
        imageZoom: 1,
        showDocumentContent: false
      });
    },

    toggleDocumentContent() {
      this.showDocumentContent = !this.showDocumentContent;
    },

    canShowContent(url) {
      return url && ['pdf', 'txt', 'html', 'htm'].includes(this.getFileExtension(url));
    },

    getContentViewerUrl(url) {
      return this.getFileExtension(url) === 'pdf' 
        ? `${url}#toolbar=1&navpanes=1&scrollbar=1` 
        : url;
    },

    zoomIn() {
      this.imageZoom = Math.min(this.imageZoom + 0.25, 3);
    },

    zoomOut() {
      this.imageZoom = Math.max(this.imageZoom - 0.25, 0.5);
    },

    resetZoom() {
      this.imageZoom = 1;
    },

    getDocumentLabel(documentTypeOrDocument) {
      if (typeof documentTypeOrDocument === 'object' && documentTypeOrDocument?.displayName) {
        return documentTypeOrDocument.displayName;
      }
      const documentType = typeof documentTypeOrDocument === 'string' 
        ? documentTypeOrDocument 
        : documentTypeOrDocument?.type;
      return DOCUMENT_TYPE_LABELS[documentType] || documentType || 'Documento';
    },

    isImageFile(url) {
      return url && IMAGE_EXTENSIONS.some(ext => url.toLowerCase().includes(ext));
    },

    getFileExtension(url) {
      if (!url) return '';
      const matches = url.match(/\.([^.]+)$/);
      return matches ? matches[1].toLowerCase() : '';
    },

    getFileIcon(url) {
      return FILE_ICONS[this.getFileExtension(url)] || 'pi-file';
    },

    getFileColor(url) {
      return FILE_COLORS[this.getFileExtension(url)] || 'text-gray-500';
    },

    handleImageError(event) {
      // Cambiar a imagen por defecto si no se puede cargar la imagen
      event.target.src = 'https://via.placeholder.com/150x100/f0f0f0/666666?text=Sin+imagen';
    }
  }
};

</script>

<template>

  <div class="flex flex-column gap-4">

    <!-- ====================== Card -> Datos del solicitante ====================== -->
    <pv-card>
      <template #header>
        <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white;">
          <i class="pi pi-briefcase" style="color: white;"></i>
          <span class="text-lg font-bold">Datos del solicitante</span>
        </div>
      </template>
      <template #content>

        <div class="formgrid grid">
          <!-- Fila 1: Razón Social, RUC y Nombre de ejecutivo -->
           <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-building text-primary"></i>
              Razón social
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.applicantCompany?.companyName || 'No disponible' }}</p>
          </div>

          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-id-card text-primary"></i>
              Ruc
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.applicantCompany?.ruc || 'No disponible' }}</p>
          </div>
          
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombre de ejecutivo
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.applicantCompany?.executiveName || 'No disponible' }}</p>
          </div>
          <!-- Fila 2: Número de contacto y Correo corporativo -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-900 m-0">{{ formatPhoneNumber(item?.applicantCompany?.contactPhoneNumber) }}</p>
          </div>
          <div class="field col-12 md:col-8">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-envelope text-primary"></i>
              Correo corporativo
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.applicantCompany?.corporateEmail || 'No disponible' }}</p>
          </div>
        </div>
      </template>
    </pv-card>



    <!-- ====================== Card -> Datos del cliente ====================== -->
    <pv-card>
      <template #header>
        <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white;">
          <i class="pi pi-user-plus" style="color: white;"></i>
          <span class="text-lg font-bold">Datos del cliente</span>
        </div>
      </template>
      <template #content>

        <div class="formgrid grid">
          <!-- Fila 1: Nombres completos, Apellidos completos y Número de contacto -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombres completos
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.client?.name || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-users text-primary"></i>
              Apellidos completos
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.client?.lastName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-900 m-0">{{ formatPhoneNumber(item?.client?.phoneNumber) }}</p>
          </div>
          <!-- Fila 2: Tipo de documento y N° de documento -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-credit-card text-primary"></i>
              Tipo de documento
            </label>
            <p class="font-semibold text-900 m-0">{{ formatDocumentType(item?.client?.identityDocument?.documentType) }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-hashtag text-primary"></i>
              N° de documento
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.client?.identityDocument?.documentNumber || 'No disponible' }}</p>
          </div>
          <!-- Fila 3: Departamento, Provincia y Distrito -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-map text-primary"></i>
              Departamento
            </label>
            <p class="font-semibold text-900 m-0">{{ (item?.client?.location?.department || 'No disponible').toUpperCase() }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-building text-primary"></i>
              Provincia
            </label>
            <p class="font-semibold text-900 m-0">{{ (item?.client?.location?.province || 'No disponible').toUpperCase() }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-flag text-primary"></i>
              Distrito
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.client?.location?.district || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-home text-primary"></i>
              Dirección de domicilio
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.client?.location?.homeAddress || 'No disponible' }}</p>
          </div>
          <!-- Ubicación en Google Maps -->
          <div class="field col-12" v-if="item?.client?.location?.mapLocation">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              Ubicación en google maps
            </label>
            <p class="text-900 m-0">
              <a
                  :href="item.client.location.mapLocation"
                  target="_blank"
                  class="text-primary no-underline hover:underline flex align-items-center gap-2"
              >
                <i class="pi pi-external-link text-sm"></i>
                {{ item.client.location.mapLocation }}
              </a>
            </p>
          </div>
          <div class="field col-12" v-else>
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              Ubicación en google maps
            </label>
            <p class="text-900 m-0">No disponible</p>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Documentos adjuntos ====================== -->
    <pv-card class="w-full">
      <template #header>
        <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white;">
          <i class="pi pi-paperclip" style="color: white;"></i>
          <span class="text-lg font-bold">Documentos adjuntos</span>
        </div>
      </template>
      <template #content>

        <div v-if="filteredDocuments && filteredDocuments.length > 0" class="formgrid grid">
          <!-- Mostrar documentos disponibles dinámicamente en 3 columnas -->
          <div
              v-for="document in filteredDocuments"
              :key="document.id"
              class="field col-12 md:col-4"
          >
            <label class="font-semibold text-600 flex align-items-center gap-2 mb-2">
              <i :class="`pi ${getFileIcon(document.url)} ${getFileColor(document.url)}`"></i>
              {{ document.displayName }}
            </label>
            <div class="flex flex-column align-items-center p-3 border-1 surface-border border-round hover:shadow-3 transition-all transition-duration-200">
              <!-- Mostrar imagen si es un archivo de imagen -->
              <div v-if="isImageFile(document.url)" class="w-full flex justify-content-center mb-3">
                <img
                    :src="document.url || 'https://via.placeholder.com/150x100'"
                    :alt="getDocumentLabel(document.type)"
                    class="w-full max-w-10rem h-6rem object-fit-cover border-round shadow-2 transition-all transition-duration-200"
                    @error="handleImageError"
                />
              </div>
              <!-- Mostrar icono para archivos no imagen -->
              <div v-else class="w-full flex flex-column align-items-center mb-3">
                <i :class="`pi ${getFileIcon(document.url)} ${getFileColor(document.url)} text-6xl mb-2 transition-all transition-duration-200`"></i>
                <span class="text-sm text-600 font-medium uppercase">{{ getFileExtension(document.url) || 'Archivo' }}</span>
              </div>
              <!-- Botones de acción -->
              <div class="flex flex-column gap-2 w-full">
                <pv-button
                    icon="pi pi-eye"
                    label="Ver"
                    class="p-button-sm p-button-primary w-full"
                    @click="viewDocument(document)"
                    :disabled="!document.url"
                />
                <pv-button
                    icon="pi pi-download"
                    label="Descargar"
                    class="p-button-sm p-button-outlined w-full"
                    @click="downloadDocument(document.type, document)"
                    :disabled="!document.url"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay documentos -->
        <div v-else class="text-center py-4">
          <i class="pi pi-file-excel text-4xl text-600"></i>
          <p class="text-600 mt-2 mb-0">No hay documentos adjuntos disponibles</p>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Datos del arrendador ====================== -->
    <pv-card class="w-full">
      <template #header>
        <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white;">
          <i class="pi pi-home" style="color: white;"></i>
          <span class="text-lg font-bold">Datos del arrendador</span>
        </div>
      </template>
      <template #content>

        <div class="formgrid grid">
          <div class="field col-12 md:col-8">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombre completo
            </label>
            <p class="font-semibold text-900 m-0">{{ item?.client?.landlord?.fullName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-600 flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-900 m-0">{{ formatPhoneNumber(item?.client?.landlord?.phoneNumber) }}</p>
          </div>
        </div>
      </template>
    </pv-card>

  </div>

  <!-- ====================== Modal para visualizar documentos ====================== -->
  <pv-dialog 
    v-model:visible="showDocumentModal" 
    :modal="true" 
    :closable="true"
    :draggable="false"
    :resizable="false"
    class="document-viewer-modal"
    :style="{ width: '90vw', maxWidth: '800px' }"
    @hide="closeModal"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <i :class="`pi ${getFileIcon(selectedDocument?.url)} ${getFileColor(selectedDocument?.url)}`"></i>
        <span class="font-semibold">{{ selectedDocument?.displayName || getDocumentLabel(selectedDocument?.type) }}</span>
      </div>
    </template>

    <div class="document-viewer-content" v-if="selectedDocument">
      <!-- Visualizador para imágenes -->
      <div v-if="isImageFile(selectedDocument.url)" class="image-viewer">
        <div class="image-controls mb-3 flex justify-content-between align-items-center">
          <div class="flex gap-2">
            <pv-button 
              icon="pi pi-minus" 
              class="p-button-sm p-button-outlined"
              @click="zoomOut"
              :disabled="imageZoom <= 0.5"
              title="Alejar"
            />
            <pv-button 
              icon="pi pi-refresh" 
              class="p-button-sm p-button-outlined"
              @click="resetZoom"
              title="Tamaño original"
            />
            <pv-button 
              icon="pi pi-plus" 
              class="p-button-sm p-button-outlined"
              @click="zoomIn"
              :disabled="imageZoom >= 3"
              title="Acercar"
            />
          </div>
          <span class="text-sm text-600">{{ Math.round(imageZoom * 100) }}%</span>
        </div>
        <div class="image-container" style="overflow: auto; max-height: 60vh; border: 1px solid #e5e7eb; border-radius: 6px;">
          <img
            :src="selectedDocument.url" 
            :alt="selectedDocument?.displayName || getDocumentLabel(selectedDocument.type)"
            :style="{ transform: `scale(${imageZoom})`, transformOrigin: 'top left', display: 'block' }"
            class="max-w-full h-auto"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Visualizador para documentos no imagen -->
      <div v-else class="document-preview">
        <!-- Vista previa con icono (cuando no se muestra contenido) -->
        <div v-if="!showDocumentContent" class="text-center py-6">
          <div class="flex flex-column align-items-center gap-4">
            <i :class="`pi ${getFileIcon(selectedDocument.url)} ${getFileColor(selectedDocument.url)} text-8xl`"></i>
            <div class="flex flex-column align-items-center gap-2">
              <h4 class="m-0">{{ selectedDocument?.displayName || getDocumentLabel(selectedDocument.type) }}</h4>
              <span class="text-lg font-medium text-color-secondary uppercase">{{ getFileExtension(selectedDocument.url) }}</span>
              <p class="text-color-secondary m-0" v-if="!canShowContent(selectedDocument.url)">
                Este tipo de archivo no se puede previsualizar
              </p>
              <p class="text-color-secondary m-0" v-else>
                Haz clic en "Ver contenido" para visualizar el documento
              </p>
            </div>
          </div>
        </div>

        <!-- Visualización del contenido del documento -->
        <div v-else class="document-content-viewer">
          <div class="content-header mb-3 flex justify-content-between align-items-center">
            <h5 class="m-0 flex align-items-center gap-2">
              <i :class="`pi ${getFileIcon(selectedDocument.url)} ${getFileColor(selectedDocument.url)}`"></i>
              Contenido del documento
            </h5>
            <pv-button 
              icon="pi pi-eye-slash" 
              label="Ocultar"
              class="p-button-sm p-button-text"
              @click="toggleDocumentContent"
            />
          </div>
          <div class="content-frame-container">
            <iframe 
              :src="getContentViewerUrl(selectedDocument.url)"
              class="document-content-frame"
              frameborder="0"
              @load="$event.target.style.opacity = '1'"
              @error="$event.target.style.display = 'none'"
            ></iframe>
            <!-- Mensaje de carga -->
            <div class="loading-message text-center py-4 text-color-secondary">
              <i class="pi pi-spin pi-spinner text-2xl mb-2"></i>
              <p class="m-0">Cargando documento...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer-container">
        <!-- Sección izquierda: Acciones del documento -->
        <div class="footer-actions-left">
          <pv-button 
            icon="pi pi-download" 
            label="Descargar"
            class="p-button-outlined"
            @click="downloadDocument(selectedDocument?.type, selectedDocument)"
            :disabled="!selectedDocument?.url"
          />
          <pv-button 
            v-if="!isImageFile(selectedDocument?.url) && canShowContent(selectedDocument?.url)"
            :icon="showDocumentContent ? 'pi pi-eye-slash' : 'pi pi-eye'"
            :label="showDocumentContent ? 'Ocultar contenido' : 'Ver contenido'"
            class="p-button-primary"
            @click="toggleDocumentContent"
          />
        </div>
        
        <!-- Sección derecha: Acción de cerrar -->
        <div class="footer-actions-right">
          <pv-button 
            icon="pi pi-times" 
            label="Cerrar"
            class="p-button-text"
            @click="closeModal"
          />
        </div>
      </div>
    </template>
  </pv-dialog>

</template>

<style scoped>

:deep(.p-card-content) {
  padding: 0.5rem;
}

/* Asegurar que la card mantenga sus bordes redondeados */
:deep(.p-card) {
  border-radius: 6px !important;
  overflow: hidden !important;
}

/* Estilos para el header de las cards */
:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  padding: 0 !important;
  border-bottom: none !important;
}


/* Estilos para el modal de documentos */
:deep(.document-viewer-modal .p-dialog-header) {
  background: var(--color-card-background);
  border-bottom: 1px solid #e5e7eb;
}

:deep(.document-viewer-modal .p-dialog-content) {
  padding: 1rem;
}

:deep(.document-viewer-modal .p-dialog-footer) {
  border-top: 1px solid #e5e7eb;
  background: var(--color-white);
}

.image-viewer .image-container {
  background: var(--color-white);
  border-radius: 6px;
}

.document-preview {
  min-height: 200px;
  background: var(--color-background);
  border-radius: 6px;
}

/* Animaciones para los controles */
.image-controls .p-button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Estilos para el visualizador de contenido */
.document-content-viewer {
  min-height: 400px;
}

.content-frame-container {
  position: relative;
  height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.document-content-frame {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.content-header {
  padding: 0.5rem;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

/* Mejorar responsividad del modal */
:deep(.document-viewer-modal) {
  max-height: 90vh;
}

:deep(.document-viewer-modal .p-dialog-content) {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

/* Estilos para el footer mejorado */
.modal-footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
  gap: 1rem;
}

.footer-actions-left {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.footer-actions-right {
  display: flex;
  align-items: center;
}

/* Responsividad del footer */
@media (max-width: 768px) {
  .modal-footer-container {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .footer-actions-left {
    justify-content: center;
    order: 2;
  }
  
  .footer-actions-right {
    justify-content: center;
    order: 1;
  }
  
  .footer-actions-left .p-button,
  .footer-actions-right .p-button {
    width: 100%;
    justify-content: center;
  }
}

/* Mejoras visuales para los botones del footer */
.footer-actions-left .p-button {
  min-width: 120px;
}

.footer-actions-right .p-button {
  min-width: 100px;
}

/* Hover effects específicos para botones del modal */
:deep(.modal-footer-container .p-button:hover) {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

:deep(.modal-footer-container .p-button:active) {
  transform: translateY(0);
}

</style>