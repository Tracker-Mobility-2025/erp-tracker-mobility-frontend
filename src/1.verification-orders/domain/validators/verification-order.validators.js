import { BusinessRules } from "../constants/verification-order.constants.js";

/**
 * Validadores del dominio para órdenes de verificación.
 * Contiene validaciones reutilizables para value objects y entidades.
 */
export class VerificationOrderValidators {
  /**
   * Valida código de orden
   * @param {string} code - Código a validar
   * @returns {{isValid: boolean, error?: string}}
   */
  static validateOrderCode(code) {
    if (!code || code.trim() === '') {
      return { isValid: false, error: 'Código de orden es requerido' };
    }
    
    if (code.length < BusinessRules.MIN_ORDER_CODE_LENGTH || 
        code.length > BusinessRules.MAX_ORDER_CODE_LENGTH) {
      return { 
        isValid: false, 
        error: `Código debe tener entre ${BusinessRules.MIN_ORDER_CODE_LENGTH} y ${BusinessRules.MAX_ORDER_CODE_LENGTH} caracteres` 
      };
    }
    
    return { isValid: true };
  }

  /**
   * Valida nombres (cliente, solicitante, etc.)
   * @param {string} name - Nombre a validar
   * @param {string} fieldName - Nombre del campo para mensajes
   * @returns {{isValid: boolean, error?: string}}
   */
  static validateName(name, fieldName = 'Nombre') {
    if (!name || name.trim() === '') {
      return { isValid: false, error: `${fieldName} es requerido` };
    }
    
    if (name.length < BusinessRules.MIN_NAME_LENGTH) {
      return { 
        isValid: false, 
        error: `${fieldName} debe tener al menos ${BusinessRules.MIN_NAME_LENGTH} caracteres` 
      };
    }
    
    if (name.length > BusinessRules.MAX_NAME_LENGTH) {
      return { 
        isValid: false, 
        error: `${fieldName} no debe exceder ${BusinessRules.MAX_NAME_LENGTH} caracteres` 
      };
    }
    
    return { isValid: true };
  }

  /**
   * Valida números de teléfono
   * @param {string} phone - Teléfono a validar
   * @returns {{isValid: boolean, error?: string}}
   */
  static validatePhoneNumber(phone) {
    if (!phone || phone.trim() === '') {
      return { isValid: false, error: 'Teléfono es requerido' };
    }
    
    const phoneDigits = phone.replace(/\D/g, '');
    
    if (phoneDigits.length < BusinessRules.MIN_PHONE_LENGTH || 
        phoneDigits.length > BusinessRules.MAX_PHONE_LENGTH) {
      return { 
        isValid: false, 
        error: `Teléfono debe tener entre ${BusinessRules.MIN_PHONE_LENGTH} y ${BusinessRules.MAX_PHONE_LENGTH} dígitos` 
      };
    }
    
    return { isValid: true };
  }
}
