<script>
export default {
  name: "file-uploader",
  
  inheritAttrs: false,
  
  props: {
    // Archivo actual
    modelValue: {
      type: File,
      default: null
    },
    // Tipo de archivo esperado
    fileType: {
      type: String,
      default: 'image', // 'image', 'document', 'any'
      validator: (value) => ['image', 'document', 'any'].includes(value)
    },
    // Configuración
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB por defecto
    },
    acceptedFormats: {
      type: Array,
      default: null // Se calculará automáticamente según fileType si no se proporciona
    },
    // Textos personalizables
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    dragText: {
      type: String,
      default: 'o arrastra aquí'
    },
    changeText: {
      type: String,
      default: 'Cambiar'
    },
    removeText: {
      type: String,
      default: 'Eliminar'
    },
    // Mensajes de error
    errorMessages: {
      type: Object,
      default: () => ({
        fileTooBig: 'El archivo es muy grande. Máximo {maxSize}',
        invalidFormat: 'Formato no válido. Formatos permitidos: {formats}'
      })
    },
    // Estados
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // ID único
    inputId: {
      type: String,
      default: () => `file-uploader-${Math.random().toString(36).substr(2, 9)}`
    }
  },

  emits: ['update:modelValue', 'file-selected', 'file-removed', 'validation-error'],

  data() {
    return {
      isDragOver: false,
      fileUrl: null
    }
  },

  computed: {
    hasFile() {
      return !!this.modelValue
    },

    fileInfo() {
      if (!this.modelValue) return null
      
      return {
        name: this.modelValue.name,
        size: this.formatFileSize(this.modelValue.size),
        type: this.modelValue.type,
        url: this.isImage ? this.fileUrl : null,
        extension: this.getFileExtension(this.modelValue.name)
      }
    },

    isImage() {
      if (!this.modelValue) return false
      return this.modelValue.type.startsWith('image/')
    },

    computedAcceptedFormats() {
      if (this.acceptedFormats) {
        return this.acceptedFormats
      }
      
      // Formatos por defecto según el tipo
      switch (this.fileType) {
        case 'image':
          return ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        case 'document':
          return [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
        case 'any':
        default:
          return [
            // Imágenes
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            // Documentos
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
      }
    },

    acceptAttribute() {
      return this.computedAcceptedFormats.join(',')
    },

    allowedExtensions() {
      return this.computedAcceptedFormats.map(format => {
        switch (format) {
          case 'application/pdf': return '.pdf'
          case 'application/msword': return '.doc'
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return '.docx'
          default:
            const ext = format.split('/')[1]
            return `.${ext}`
        }
      }).join(', ')
    },

    placeholderText() {
      if (this.placeholder) return this.placeholder
      
      switch (this.fileType) {
        case 'image': return 'Haz clic para subir imagen'
        case 'document': return 'Haz clic para subir documento'
        case 'any':
        default: return 'Haz clic para subir archivo'
      }
    },

    iconClass() {
      if (this.hasFile && this.isImage) return 'pi pi-image'
      
      switch (this.fileType) {
        case 'image': return 'pi pi-image'
        case 'document': return 'pi pi-file'
        case 'any':
        default: return 'pi pi-upload'
      }
    },

    fileTypeIcon() {
      if (!this.hasFile) return null
      
      if (this.isImage) return 'pi pi-image'
      
      const ext = this.fileInfo.extension.toLowerCase()
      switch (ext) {
        case 'pdf': return 'pi pi-file-pdf'
        case 'doc':
        case 'docx': return 'pi pi-file-word'
        default: return 'pi pi-file'
      }
    }
  },

  watch: {
    modelValue(newFile) {
      // Limpiar URL anterior
      if (this.fileUrl) {
        URL.revokeObjectURL(this.fileUrl)
        this.fileUrl = null
      }
      
      // Crear nueva URL si hay archivo y es imagen
      if (newFile && newFile.type.startsWith('image/')) {
        this.fileUrl = URL.createObjectURL(newFile)
      }
    }
  },

  methods: {
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
    },

    getFileExtension(filename) {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
    },

    validateFile(file) {
      const errors = []
      
      // Validar tamaño
      if (file.size > this.maxFileSize) {
        const message = this.errorMessages.fileTooBig.replace(
          '{maxSize}', 
          this.formatFileSize(this.maxFileSize)
        )
        errors.push({
          type: 'size',
          message
        })
      }
      
      // Validar formato
      if (!this.computedAcceptedFormats.includes(file.type)) {
        const message = this.errorMessages.invalidFormat.replace(
          '{formats}', 
          this.allowedExtensions
        )
        errors.push({
          type: 'format',
          message
        })
      }
      
      return errors
    },

    handleFileSelect(file) {
      if (!file || this.disabled) return
      
      const validationErrors = this.validateFile(file)
      
      if (validationErrors.length > 0) {
        this.$emit('validation-error', validationErrors)
        // Limpiar input si hay errores
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = ''
        }
        return
      }
      
      // Emitir eventos
      this.$emit('update:modelValue', file)
      this.$emit('file-selected', file)
    },

    openFileDialog() {
      if (this.disabled) return
      this.$refs.fileInput?.click()
    },

    onInputChange(event) {
      const file = event.target.files?.[0]
      if (file) {
        this.handleFileSelect(file)
      }
    },

    onDragOver(event) {
      event.preventDefault()
      if (!this.disabled) {
        this.isDragOver = true
      }
    },

    onDragLeave(event) {
      event.preventDefault()
      this.isDragOver = false
    },

    onDrop(event) {
      event.preventDefault()
      this.isDragOver = false
      
      if (this.disabled) return
      
      const file = event.dataTransfer?.files?.[0]
      if (file) {
        this.handleFileSelect(file)
      }
    },

    removeFile() {
      if (this.disabled) return
      
      // Limpiar URL
      if (this.fileUrl) {
        URL.revokeObjectURL(this.fileUrl)
        this.fileUrl = null
      }
      
      // Limpiar input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
      
      // Emitir eventos
      this.$emit('update:modelValue', null)
      this.$emit('file-removed')
    },

    onKeyDown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (!this.hasFile) {
          this.openFileDialog()
        }
      }
    }
  },

  beforeUnmount() {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl)
    }
  }
}
</script>

<template>
  <div class="file-uploader">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      class="file-uploader__label font-medium"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Dropzone -->
    <div
      class="file-uploader__dropzone"
      :class="{
        'file-uploader__dropzone--filled': hasFile,
        'file-uploader__dropzone--drag-over': isDragOver,
        'file-uploader__dropzone--disabled': disabled
      }"
      :tabindex="disabled ? -1 : 0"
      role="button"
      :aria-label="hasFile ? `Archivo seleccionado: ${fileInfo?.name}` : placeholderText"
      :aria-describedby="`${inputId}-hint`"
      @click="openFileDialog"
      @keydown="onKeyDown"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <!-- Estado vacío -->
      <div v-if="!hasFile" class="file-uploader__empty">
        <i 
          :class="iconClass" 
          class="file-uploader__icon"
          aria-hidden="true"
        ></i>
        <div class="file-uploader__cta">
          <span class="file-uploader__link">{{ placeholderText }}</span>
          <span v-if="dragText" class="file-uploader__muted"> {{ dragText }}</span>
        </div>
        <div 
          v-if="hint"
          :id="`${inputId}-hint`" 
          class="file-uploader__hint"
        >
          {{ hint }}
        </div>
      </div>

      <!-- Estado con archivo -->
      <div v-else class="file-uploader__filled">
        <!-- Preview para imágenes -->
        <div v-if="isImage" class="file-uploader__preview">
          <img 
            :src="fileInfo.url" 
            :alt="fileInfo.name"
            class="file-uploader__image"
          />
        </div>
        <!-- Icono para documentos -->
        <div v-else class="file-uploader__file-icon">
          <i :class="fileTypeIcon" class="file-uploader__type-icon"></i>
        </div>
        
        <div class="file-uploader__meta">
          <div class="file-uploader__filename">{{ fileInfo.name }}</div>
          <div class="file-uploader__size">{{ fileInfo.size }}</div>
        </div>
        <div class="file-uploader__actions" v-if="!disabled">
          <button 
            type="button" 
            class="file-uploader__action-link"
            @click.stop="openFileDialog"
            :aria-label="`${changeText} archivo ${fileInfo.name}`"
          >
            {{ changeText }}
          </button>
          <span class="file-uploader__separator">·</span>
          <button 
            type="button" 
            class="file-uploader__action-link file-uploader__action-link--danger"
            @click.stop="removeFile"
            :aria-label="`${removeText} archivo ${fileInfo.name}`"
          >
            {{ removeText }}
          </button>
        </div>
      </div>

      <!-- Input nativo oculto -->
      <input
        ref="fileInput"
        :id="inputId"
        type="file"
        class="file-uploader__input"
        :accept="acceptAttribute"
        :disabled="disabled"
        @change="onInputChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* Componente base */
.file-uploader {
  width: 100%;
}

.file-uploader__label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
}

/* Input nativo oculto pero accesible */
.file-uploader__input {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}

/* Dropzone */
.file-uploader__dropzone {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 144px;
  padding: 1.25rem;
  border: 2px dashed #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.file-uploader__dropzone:hover:not(.file-uploader__dropzone--disabled),
.file-uploader__dropzone--drag-over {
  border-color: #cbd5e1;
  background: #fafafa;
}

.file-uploader__dropzone:focus {
  box-shadow: 0 0 0 3px rgba(46, 61, 180, 0.15);
  border-color: #9aa7ff;
}

.file-uploader__dropzone--filled {
  border-style: solid;
  border-color: #D1D5DB;
  background: #fff;
}

.file-uploader__dropzone--disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #f9fafb;
}

/* Estado vacío */
.file-uploader__empty {
  text-align: center;
  width: 100%;
}

.file-uploader__icon {
  font-size: 1.5rem;
  color: #c1c8d2;
  display: block;
  margin-bottom: 0.35rem;
}

.file-uploader__cta {
  font-size: 1.1rem;
  line-height: 1.2;
}

.file-uploader__link {
  color: #2E3DB4;
  font-weight: 600;
}

.file-uploader__muted {
  color: #9CA3AF;
}

.file-uploader__hint {
  margin-top: 0.25rem;
  color: #B1B6BE;
  font-size: 0.875rem;
}

/* Estado con archivo */
.file-uploader__filled {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.file-uploader__preview {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #E5E7EB;
}

.file-uploader__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.file-uploader__file-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f3f4f6;
  border: 1px solid #E5E7EB;
}

.file-uploader__type-icon {
  font-size: 1.5rem;
  color: #6b7280;
}

.file-uploader__meta {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.file-uploader__filename {
  font-weight: 600;
  color: #374151;
  word-break: break-all;
}

.file-uploader__size {
  color: #6B7280;
  font-size: 0.9rem;
}

.file-uploader__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.file-uploader__action-link {
  background: none;
  border: 0;
  padding: 0;
  color: #2E3DB4;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.file-uploader__action-link:hover {
  text-decoration: underline;
}

.file-uploader__action-link--danger {
  color: #dc2626;
}

.file-uploader__separator {
  color: #9CA3AF;
  user-select: none;
}

/* Responsive */
@media (max-width: 768px) {
  .file-uploader__dropzone {
    min-height: 120px;
    padding: 1rem;
  }
  
  .file-uploader__filled {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .file-uploader__preview,
  .file-uploader__file-icon {
    align-self: center;
  }
  
  .file-uploader__actions {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}
</style>
