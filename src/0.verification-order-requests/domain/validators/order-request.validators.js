import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { DocumentNumber } from '../value-objects/document-number.vo.js';

/**
 * Validadores del dominio para solicitudes de orden.
 * Contiene validaciones específicas del negocio.
 * Combina validaciones básicas con Value Objects para validar formato.
 */
export class OrderRequestValidators {
  /**
   * Valida que un campo requerido no esté vacío
   * @param {*} value - Valor a validar
   * @param {string} fieldName - Nombre del campo para mensaje de error
   */
  static validateRequiredField(value, fieldName) {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${fieldName} es obligatorio`);
    }
  }

  /**
   * Valida nombres (mínimo 2 caracteres, solo letras y espacios)
   * @param {string} name - Nombre a validar
   * @param {string} fieldName - Nombre del campo
   */
  static validateName(name, fieldName) {
    this.validateRequiredField(name, fieldName);
    
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      throw new Error(`${fieldName} debe tener al menos 2 caracteres`);
    }
    
    if (trimmedName.length > 100) {
      throw new Error(`${fieldName} no puede exceder 100 caracteres`);
    }
    
    // Permitir letras, espacios, acentos y caracteres especiales de nombres
    const nameRegex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'.-]+$/;
    if (!nameRegex.test(trimmedName)) {
      throw new Error(`${fieldName} solo puede contener letras, espacios y caracteres válidos`);
    }
  }

  /**
   * Valida tipo de documento
   * @param {string} documentType - Tipo de documento
   */
  static validateDocumentType(documentType) {
    const validTypes = ['DNI', 'CARNET_EXTRANJERIA', 'PTP'];
    if (!validTypes.includes(documentType)) {
      throw new Error('Tipo de documento inválido. Debe ser DNI, CARNET_EXTRANJERIA o PTP');
    }
  }

  /**
   * Valida número de documento según el tipo
   * @param {string|number} documentNumber - Número de documento
   * @param {string} documentType - Tipo de documento
   */
  static validateDocumentNumber(documentNumber, documentType) {
    this.validateRequiredField(documentNumber, 'Número de documento');
    
    const numStr = documentNumber.toString().replace(/\s/g, '');
    
    switch (documentType) {
      case 'DNI':
        if (!/^\d{8}$/.test(numStr)) {
          throw new Error('DNI debe tener exactamente 8 dígitos');
        }
        break;
      
      case 'CARNET_EXTRANJERIA':
      case 'PTP':
        if (!/^\d{9,12}$/.test(numStr)) {
          throw new Error('Carnet de extranjería/PTP debe tener entre 9 y 12 dígitos');
        }
        break;
      
      default:
        throw new Error('Tipo de documento no soportado para validación');
    }
  }

  /**
   * Valida número de teléfono peruano usando PhoneNumber VO
   * @param {string|number} phoneNumber - Número de teléfono
   * @param {string} fieldName - Nombre del campo
   */
  static validatePhoneNumber(phoneNumber, fieldName) {
    this.validateRequiredField(phoneNumber, fieldName);
    
    try {
      new PhoneNumber(phoneNumber);
    } catch (error) {
      throw new Error(`${fieldName}: ${error.message}`);
    }
  }

  /**
   * Valida dirección (mínimo 10 caracteres, máximo 300)
   * @param {string} address - Dirección
   */
  static validateAddress(address) {
    this.validateRequiredField(address, 'Dirección');
    
    const trimmedAddress = address.trim();
    if (trimmedAddress.length < 10) {
      throw new Error('Dirección debe tener al menos 10 caracteres');
    }
    
    if (trimmedAddress.length > 300) {
      throw new Error('Dirección no puede exceder 300 caracteres');
    }
  }

  /**
   * Valida RUC peruano (11 dígitos)
   * @param {string|number} ruc - RUC
   */
  static validateRuc(ruc) {
    this.validateRequiredField(ruc, 'RUC');
    
    const rucStr = ruc.toString().replace(/\s/g, '');
    
    if (!/^\d{11}$/.test(rucStr)) {
      throw new Error('RUC debe tener exactamente 11 dígitos');
    }
    
    // RUC en Perú comienza con 10, 15, 17 o 20
    const prefix = rucStr.substring(0, 2);
    if (!['10', '15', '17', '20'].includes(prefix)) {
      throw new Error('RUC debe comenzar con 10, 15, 17 o 20');
    }
  }

  /**
   * Valida email usando Email VO
   * @param {string} email - Email
   */
  static validateEmail(email) {
    this.validateRequiredField(email, 'Email');
    
    try {
      new Email(email);
    } catch (error) {
      throw new Error(error.message);
    }
    
    if (email.length > 100) {
      throw new Error('Email no puede exceder 100 caracteres');
    }
  }
}
