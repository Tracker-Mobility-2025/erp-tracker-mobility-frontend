/**
 * Mixin para funcionalidad de visualización de imágenes/documentos en modal
 * Similar a la implementación en service-orders
 */
export const ImageViewerMixin = {
  data() {
    return {
      showDocumentModal: false,
      selectedDocument: null,
      imageZoom: 1,
      showDocumentContent: false
    };
  },

  methods: {
    /**
     * Abrir modal con la imagen seleccionada
     */
    openImageModal(image) {
      this.selectedDocument = {
        url: image.src,
        displayName: image.description || image.alt,
        type: 'image',
        alt: image.alt
      };
      this.imageZoom = 1;
      this.showDocumentModal = true;
    },

    /**
     * Cerrar modal de visualización
     */
    closeModal() {
      this.showDocumentModal = false;
      this.selectedDocument = null;
      this.imageZoom = 1;
      this.showDocumentContent = false;
    },

    /**
     * Descargar imagen
     */
    async downloadImage(image) {
      try {
        if (!image || !image.src) {
          console.warn('No se puede descargar la imagen: URL no válida');
          return;
        }

        console.log('Iniciando descarga de:', image.src);

        // Mostrar toast de inicio de descarga
        this.showToast('info', 'Descargando...', 'Preparando la descarga de la imagen');

        // Realizar la descarga
        await this.performDownload(image.src, this.generateFileName(image));

        console.log('Imagen descargada correctamente');

      } catch (error) {
        console.error('Error al descargar imagen:', error);
        this.showToast('error', 'Error de descarga', 'No se pudo descargar la imagen. Intente nuevamente.');
      }
    },

    /**
     * Ejecutar descarga del archivo
     */
    async performDownload(url, filename) {
      // Para imágenes, intentar método canvas primero
      if (this.isImageFile(url)) {
        console.log('Detectada imagen, usando método canvas para:', url);
        try {
          await this.downloadImageWithCanvas(url, filename);
          return;
        } catch (error) {
          console.warn('Método canvas falló, intentando fetch:', error);
        }
      }

      try {
        console.log('Intentando descarga con fetch para:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': '*/*',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        console.log('Archivo descargado como blob, tamaño:', blob.size);
        this.downloadBlob(blob, filename);

      } catch (error) {
        console.warn('Descarga con fetch falló, usando método alternativo:', error);
        this.downloadWithLink(url, filename);
      }
    },

    /**
     * Descargar imagen usando canvas
     */
    async downloadImageWithCanvas(url, filename) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

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

        img.src = url;
      });
    },

    /**
     * Descargar blob
     */
    downloadBlob(blob, filename) {
      try {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);

      } catch (error) {
        console.error('Error en downloadBlob:', error);
        throw error;
      }
    },

    /**
     * Descargar con enlace directo
     */
    downloadWithLink(url, filename) {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'imagen';
        link.target = '_blank';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 100);

      } catch (error) {
        console.error('Error en downloadWithLink:', error);
        window.open(url, '_blank');
      }
    },

    /**
     * Generar nombre de archivo
     */
    generateFileName(image) {
      const timestamp = new Date().toISOString().slice(0, 10);
      const description = (image.description || image.alt || 'imagen').replace(/[^a-zA-Z0-9]/g, '_');
      const extension = this.getFileExtension(image.src) || 'png';

      return `${description}_${timestamp}.${extension}`;
    },

    /**
     * Verificar si es archivo de imagen
     */
    isImageFile(url) {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const urlLower = url.toLowerCase();
      return imageExtensions.some(ext => urlLower.includes(ext));
    },

    /**
     * Obtener extensión del archivo
     */
    getFileExtension(url) {
      if (!url) return '';
      const matches = url.match(/\.([^.]+)$/);
      return matches ? matches[1].toLowerCase() : '';
    },

    /**
     * Obtener icono según tipo de archivo
     */
    getFileIcon(url) {
      const extension = this.getFileExtension(url);
      const iconMap = {
        'pdf': 'pi-file-pdf',
        'doc': 'pi-file-word',
        'docx': 'pi-file-word',
        'jpg': 'pi-image',
        'jpeg': 'pi-image',
        'png': 'pi-image',
        'gif': 'pi-image',
        'bmp': 'pi-image',
        'webp': 'pi-image',
      };
      return iconMap[extension] || 'pi-file';
    },

    /**
     * Obtener color según tipo de archivo
     */
    getFileColor(url) {
      const extension = this.getFileExtension(url);
      const colorMap = {
        'pdf': 'text-red-500',
        'jpg': 'text-blue-500',
        'jpeg': 'text-blue-500',
        'png': 'text-blue-500',
        'gif': 'text-purple-500',
      };
      return colorMap[extension] || 'text-gray-500';
    },

    /**
     * Zoom in
     */
    zoomIn() {
      if (this.imageZoom < 3) {
        this.imageZoom += 0.25;
      }
    },

    /**
     * Zoom out
     */
    zoomOut() {
      if (this.imageZoom > 0.5) {
        this.imageZoom -= 0.25;
      }
    },

    /**
     * Reset zoom
     */
    resetZoom() {
      this.imageZoom = 1;
    },

    /**
     * Manejar error de carga de imagen
     */
    handleImageError(event) {
      console.error('Error al cargar imagen:', event.target.src);
      event.target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Imagen+no+disponible';
    },

    /**
     * Mostrar toast notification
     */
    showToast(severity, summary, detail, life = 3000) {
      try {
        if (this.$toast && typeof this.$toast.add === 'function') {
          this.$toast.add({
            severity: severity,
            summary: summary,
            detail: detail,
            life: life
          });
        } else {
          console.log(`${summary}: ${detail}`);
        }
      } catch (error) {
        console.warn('Toast no disponible:', error);
      }
    }
  }
};

