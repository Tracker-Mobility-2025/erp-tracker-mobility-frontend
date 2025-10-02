<script>


export default {
  name: 'order-description',

  props : {
    item: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showDocumentModal: false,
      selectedDocument: null,
      imageZoom: 1,
      showDocumentContent: false
    }
  },

  methods: {
    downloadDocument(type, document = null) {
      // Lógica para descargar documento
      console.log(`Descargar documento: ${type}`, document);
      // Aquí iría la lógica real de descarga
      this.$emit('download-document', { type, item: this.item, document });
    },

    viewDocument(document) {
      this.selectedDocument = document;
      this.imageZoom = 1; // Reset zoom
      this.showDocumentModal = true;
    },

    closeModal() {
      this.showDocumentModal = false;
      this.selectedDocument = null;
      this.imageZoom = 1;
      this.showDocumentContent = false;
    },

    toggleDocumentContent() {
      this.showDocumentContent = !this.showDocumentContent;
    },

    canShowContent(url) {
      if (!url) return false;
      const extension = this.getFileExtension(url);
      // Tipos de archivo que se pueden mostrar en iframe
      const supportedTypes = ['pdf', 'txt', 'html', 'htm'];
      return supportedTypes.includes(extension);
    },

    getContentViewerUrl(url) {
      const extension = this.getFileExtension(url);
      if (extension === 'pdf') {
        // Para PDFs, usar el visor nativo del navegador
        return url + '#toolbar=1&navpanes=1&scrollbar=1';
      }
      return url;
    },

    zoomIn() {
      if (this.imageZoom < 3) {
        this.imageZoom += 0.25;
      }
    },

    zoomOut() {
      if (this.imageZoom > 0.5) {
        this.imageZoom -= 0.25;
      }
    },

    resetZoom() {
      this.imageZoom = 1;
    },

    getDocumentLabel(documentType) {
      const labels = {
        'identity': 'Documento de identidad',
        'receipt': 'Recibo de servicios (agua o luz)',
        'contract': 'Contrato de alquiler',
        'other': 'Otro documento'
      };
      return labels[documentType] || documentType || 'Documento';
    },

    isImageFile(url) {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const urlLower = url.toLowerCase();
      return imageExtensions.some(ext => urlLower.includes(ext));
    },

    getFileExtension(url) {
      if (!url) return '';
      const matches = url.match(/\.([^.]+)$/);
      return matches ? matches[1].toLowerCase() : '';
    },

    getFileIcon(url) {
      const extension = this.getFileExtension(url);
      const iconMap = {
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
      return iconMap[extension] || 'pi-file';
    },

    getFileColor(url) {
      const extension = this.getFileExtension(url);
      const colorMap = {
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
      return colorMap[extension] || 'text-gray-500';
    },

    handleImageError(event) {
      // Cambiar a imagen por defecto si no se puede cargar la imagen
      event.target.src = 'https://via.placeholder.com/150x100/f0f0f0/666666?text=Sin+imagen';
    }
  }
};

</script>

<template>

  <div class="flex flex-column pb-4 gap-4">

    <!-- ====================== Card -> Datos del solicitante ====================== -->
    <pv-card class="w-full">
      <template #content >
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-briefcase"></i>
          Datos del solicitante
        </h3>

        <div class="formgrid grid">
          <!-- Fila 1: RUC, Razón Social y Nombre de ejecutivo -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-id-card text-primary"></i>
              Ruc
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.ruc || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-building text-primary"></i>
              Razón social
            </label>
            <p class=" font-semibold text-dark m-0">{{ item?.applicantCompany?.companyName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombre de ejecutivo
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.executiveName || 'No disponible' }}</p>
          </div>
          <!-- Fila 2: Número de contacto y Correo corporativo -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.contactPhoneNumber || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-8">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-envelope text-primary"></i>
              Correo corporativo
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.corporateEmail || 'No disponible' }}</p>
          </div>
        </div>
      </template>
    </pv-card>



    <!-- ====================== Card -> Datos del cliente ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-user-plus"></i>
          Datos del cliente
        </h3>

        <div class="formgrid grid">
          <!-- Fila 1: Nombres completos, Apellidos completos y Tipo de documento -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombres completos
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.name || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-users text-primary"></i>
              Apellidos completos
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.lastName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-credit-card text-primary"></i>
              Tipo de documento
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.identityDocument?.documentType || 'No disponible' }}</p>
          </div>
          <!-- Fila 2: N° de documento, Número de contacto y Dirección de domicilio -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-hashtag text-primary"></i>
              N° de documento de identidad
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.identityDocument?.documentNumber || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.phoneNumber || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-home text-primary"></i>
              Dirección de domicilio
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.dwelling?.homeAddress || 'No disponible' }}</p>
          </div>
          <!-- Ubicación en Google Maps -->
          <div class="field col-12" v-if="item?.client?.location?.mapLocation">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              Ubicación en google maps
            </label>
            <p class="text-color m-0">
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
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              Ubicación en google maps
            </label>
            <p class="text-color m-0">No disponible</p>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Documentos adjuntos ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-paperclip"></i>
          Documentos adjuntos
        </h3>

        <div v-if="item?.client?.documents && item.client.documents.length > 0" class="formgrid grid">
          <!-- Mostrar documentos disponibles dinámicamente en 3 columnas -->
          <div
              v-for="document in item.client.documents"
              :key="document.id"
              class="field col-12 md:col-4"
          >
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i :class="`pi ${getFileIcon(document.url)} ${getFileColor(document.url)}`"></i>
              {{ getDocumentLabel(document.type) }}
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
                <span class="text-sm text-color-secondary font-medium uppercase">{{ getFileExtension(document.url) || 'Archivo' }}</span>
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
          <i class="pi pi-file-excel text-4xl text-color-secondary"></i>
          <p class="text-color-secondary mt-2 mb-0">No hay documentos adjuntos disponibles</p>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Datos del arrendador ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-home"></i>
          Datos del arrendador
        </h3>

        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombre completo
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.landlord?.fullName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.landlord?.phoneNumber || 'No disponible' }}</p>
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
        <span class="font-semibold">{{ getDocumentLabel(selectedDocument?.type) }}</span>
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
          <span class="text-sm text-color-secondary">{{ Math.round(imageZoom * 100) }}%</span>
        </div>
        <div class="image-container" style="overflow: auto; max-height: 60vh; border: 1px solid var(--surface-border); border-radius: 6px;">
          <img 
            :src="selectedDocument.url" 
            :alt="getDocumentLabel(selectedDocument.type)"
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
              <h4 class="m-0">{{ getDocumentLabel(selectedDocument.type) }}</h4>
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
      <div class="flex justify-content-between align-items-center w-full">
        <div class="flex gap-2">
          <pv-button 
            icon="pi pi-download" 
            label="Descargar"
            class="p-button-outlined"
            @click="downloadDocument(selectedDocument?.type, selectedDocument)"
          />
          <pv-button 
            v-if="!isImageFile(selectedDocument?.url) && canShowContent(selectedDocument?.url)"
            :icon="showDocumentContent ? 'pi pi-eye-slash' : 'pi pi-eye'"
            :label="showDocumentContent ? 'Ocultar contenido' : 'Ver contenido'"
            class="p-button-outlined"
            @click="toggleDocumentContent"
          />
        </div>
        <pv-button 
          icon="pi pi-times" 
          label="Cerrar"
          class="p-button-text"
          @click="closeModal"
        />
      </div>
    </template>
  </pv-dialog>

</template>

<style scoped>

:deep(.p-card-content) {
  padding: 0.5rem;
}

/* Estilos para el modal de documentos */
:deep(.document-viewer-modal .p-dialog-header) {
  background: var(--primary-50);
  border-bottom: 1px solid var(--surface-border);
}

:deep(.document-viewer-modal .p-dialog-content) {
  padding: 1rem;
}

:deep(.document-viewer-modal .p-dialog-footer) {
  border-top: 1px solid var(--surface-border);
  background: var(--surface-ground);
}

.image-viewer .image-container {
  background: var(--surface-ground);
  border-radius: 6px;
}

.document-preview {
  min-height: 200px;
  background: var(--surface-50);
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
  border: 1px solid var(--surface-border);
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
  background: var(--surface-100);
  border-radius: 6px;
  border: 1px solid var(--surface-border);
}

/* Mejorar responsividad del modal */
:deep(.document-viewer-modal) {
  max-height: 90vh;
}

:deep(.document-viewer-modal .p-dialog-content) {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

</style>