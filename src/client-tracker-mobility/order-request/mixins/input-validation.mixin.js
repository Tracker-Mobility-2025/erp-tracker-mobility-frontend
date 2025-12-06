/**
 * Mixin para validación de inputs de texto y numéricos
 * Proporciona métodos y directivas para validar campos de formulario
 */

export const InputValidationMixin = {
  methods: {
    /**
     * Validar que solo se ingresen letras y espacios
     * @param {KeyboardEvent} event - Evento de teclado
     */
    validateTextOnly(event) {
      const char = event.key;

      // Permitir teclas especiales (backspace, delete, arrows, tab, etc.)
      if (
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'Tab' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Home' ||
        event.key === 'End' ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      // Permitir solo letras (mayúsculas, minúsculas, con acentos y ñ), espacios y guiones
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]$/;

      if (!regex.test(char)) {
        event.preventDefault();
        this.showInputError('Solo se permiten letras y espacios');
      }
    },

    /**
     * Validar que solo se ingresen números
     * @param {KeyboardEvent} event - Evento de teclado
     */
    validateNumbersOnly(event) {
      const char = event.key;

      // Permitir teclas especiales
      if (
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'Tab' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Home' ||
        event.key === 'End' ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      // Permitir solo números
      const regex = /^[0-9]$/;

      if (!regex.test(char)) {
        event.preventDefault();
        this.showInputError('Solo se permiten números');
      }
    },

    /**
     * Validar que solo se ingresen números de teléfono (9 dígitos, inicia con 9)
     * @param {KeyboardEvent} event - Evento de teclado
     * @param {string} currentValue - Valor actual del input
     */
    validatePhoneNumber(event, currentValue) {
      const char = event.key;

      // Permitir teclas especiales
      if (
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'Tab' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Home' ||
        event.key === 'End' ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      // Permitir solo números
      const regex = /^[0-9]$/;

      if (!regex.test(char)) {
        event.preventDefault();
        this.showInputError('Solo se permiten números');
        return;
      }

      // Validar que el primer dígito sea 9
      const cleanValue = String(currentValue || '').replace(/[\s-]/g, '');
      if (cleanValue.length === 0 && char !== '9') {
        event.preventDefault();
        this.showInputError('El teléfono debe iniciar con 9');
        return;
      }

      // Validar longitud máxima (9 dígitos sin espacios)
      if (cleanValue.length >= 9) {
        event.preventDefault();
        this.showInputError('El teléfono debe tener máximo 9 dígitos');
      }
    },

    /**
     * Limpiar solo texto (eliminar números y caracteres especiales)
     * @param {string} value - Valor a limpiar
     * @returns {string} - Valor limpio
     */
    cleanTextInput(value) {
      if (!value) return '';
      // Mantener solo letras, espacios, acentos, ñ y guiones
      return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]/g, '');
    },

    /**
     * Limpiar solo números
     * @param {string} value - Valor a limpiar
     * @returns {string} - Valor limpio
     */
    cleanNumberInput(value) {
      if (!value) return '';
      // Mantener solo números
      return value.replace(/[^0-9]/g, '');
    },

    /**
     * Validar y limpiar input en paste
     * @param {ClipboardEvent} event - Evento de pegado
     * @param {string} type - Tipo de validación ('text' o 'number')
     */
    handlePaste(event, type = 'text') {
      event.preventDefault();

      const pastedData = event.clipboardData.getData('text');
      let cleanedData = '';

      if (type === 'text') {
        cleanedData = this.cleanTextInput(pastedData);
        if (cleanedData !== pastedData) {
          this.showInputError('Se han eliminado caracteres no permitidos (solo se permiten letras)');
        }
      } else if (type === 'number') {
        cleanedData = this.cleanNumberInput(pastedData);
        if (cleanedData !== pastedData) {
          this.showInputError('Se han eliminado caracteres no permitidos (solo se permiten números)');
        }
      }

      // Insertar el texto limpio
      const input = event.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentValue = input.value;

      const newValue = currentValue.substring(0, start) + cleanedData + currentValue.substring(end);

      // Actualizar el valor usando v-model
      input.value = newValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Posicionar el cursor
      const newCursorPosition = start + cleanedData.length;
      this.$nextTick(() => {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    },

    /**
     * Mostrar mensaje de error de validación
     * @param {string} message - Mensaje de error
     */
    showInputError(message) {
      // Evitar múltiples toasts del mismo mensaje en corto tiempo
      if (this._lastErrorMessage === message &&
          this._lastErrorTime &&
          Date.now() - this._lastErrorTime < 2000) {
        return;
      }

      this._lastErrorMessage = message;
      this._lastErrorTime = Date.now();

      // Intentar usar toast de PrimeVue
      if (this.$toast && typeof this.$toast.add === 'function') {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validación de campo',
          detail: message,
          life: 2000
        });
      } else {
        // Fallback: console
        console.warn('Validación:', message);
      }
    },

    /**
     * Formatear nombre propio (primera letra mayúscula)
     * @param {string} text - Texto a formatear
     * @returns {string} - Texto formateado
     */
    formatProperName(text) {
      if (!text) return '';

      return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    /**
     * Validar longitud de texto
     * @param {string} value - Valor a validar
     * @param {number} min - Longitud mínima
     * @param {number} max - Longitud máxima
     * @returns {object} - {valid: boolean, message: string}
     */
    validateTextLength(value, min = 2, max = 100) {
      if (!value || value.trim().length < min) {
        return {
          valid: false,
          message: `Debe tener al menos ${min} caracteres`
        };
      }

      if (value.trim().length > max) {
        return {
          valid: false,
          message: `Debe tener máximo ${max} caracteres`
        };
      }

      return { valid: true, message: '' };
    },

    /**
     * Validar número de documento según tipo
     * @param {string} documentType - Tipo de documento
     * @param {string} documentNumber - Número de documento
     * @returns {object} - {valid: boolean, message: string}
     */
    validateDocumentNumber(documentType, documentNumber) {
      if (!documentNumber) {
        return { valid: false, message: 'El número de documento es obligatorio' };
      }

      const num = String(documentNumber).replace(/\s/g, '');

      switch (documentType) {
        case 'DNI':
          if (!/^\d{8}$/.test(num)) {
            return { valid: false, message: 'El DNI debe tener 8 dígitos' };
          }
          break;

        case 'CARNET_EXTRANJERIA':
          if (!/^\d{9,12}$/.test(num)) {
            return { valid: false, message: 'El carnet de extranjería debe tener entre 9 y 12 dígitos' };
          }
          break;

        case 'PTP':
          if (!/^\d{9,12}$/.test(num)) {
            return { valid: false, message: 'El PTP debe tener entre 9 y 12 dígitos' };
          }
          break;

        default:
          return { valid: false, message: 'Tipo de documento no válido' };
      }

      return { valid: true, message: '' };
    }
  }
};

