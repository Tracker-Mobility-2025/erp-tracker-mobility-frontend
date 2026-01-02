import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { WorkSchedule } from '../value-objects/work-schedule.vo.js';
import { BusinessRules, VerifierMessages } from '../constants/verifier.constants.js';

/**
 * Validadores centralizados del dominio de verificadores.
 * Fuente única de verdad para reglas de validación.
 * Evita duplicación de lógica entre Commands, VOs y capa de presentación.
 * 
 * @class VerifierValidators
 */
export class VerifierValidators {
  /**
   * Valida un email.
   * @param {string} email - Email a validar
   * @returns {{ valid: boolean, message?: string }} Resultado de validación
   */
  static validateEmail(email) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      return { valid: false, message: VerifierMessages.EMAIL_REQUIRED };
    }

    try {
      new Email(email);
      return { valid: true };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }

  /**
   * Valida una contraseña.
   * Reglas: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.
   * @param {string} password - Contraseña a validar
   * @returns {{ valid: boolean, message?: string }} Resultado de validación
   */
  static validatePassword(password) {
    if (!password) {
      return { valid: false, message: 'La contraseña es requerida' };
    }

    if (password.length < BusinessRules.MIN_PASSWORD_LENGTH) {
      return { 
        valid: false, 
        message: `La contraseña debe tener al menos ${BusinessRules.MIN_PASSWORD_LENGTH} caracteres` 
      };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return { 
        valid: false, 
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
      };
    }

    return { valid: true };
  }

  /**
   * Valida un número de teléfono.
   * @param {string} phoneNumber - Teléfono a validar
   * @returns {{ valid: boolean, message?: string }} Resultado de validación
   */
  static validatePhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return { valid: false, message: VerifierMessages.PHONE_REQUIRED };
    }

    try {
      new PhoneNumber(phoneNumber);
      return { valid: true };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }

  /**
   * Valida un nombre o apellido.
   * @param {string} name - Nombre a validar
   * @param {string} fieldName - Nombre del campo (para mensajes de error)
   * @returns {{ valid: boolean, message?: string }} Resultado de validación
   */
  static validateName(name, fieldName = 'Nombre') {
    if (!name || typeof name !== 'string') {
      return { valid: false, message: `${fieldName} es requerido` };
    }

    const trimmed = name.trim();
    
    if (trimmed.length < BusinessRules.MIN_NAME_LENGTH) {
      return { 
        valid: false, 
        message: `${fieldName} debe tener al menos ${BusinessRules.MIN_NAME_LENGTH} caracteres` 
      };
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(trimmed)) {
      return { 
        valid: false, 
        message: `${fieldName} solo puede contener letras y espacios` 
      };
    }

    return { valid: true };
  }

  /**
   * Valida una agenda/horario de trabajo.
   * @param {string} agenda - Agenda a validar
   * @returns {{ valid: boolean, message?: string }} Resultado de validación
   */
  static validateAgenda(agenda) {
    if (!agenda || typeof agenda !== 'string') {
      return { valid: false, message: 'La agenda es requerida' };
    }

    const trimmed = agenda.trim();
    
    if (trimmed.length < 10) {
      return { 
        valid: false, 
        message: 'La agenda debe tener al menos 10 caracteres' 
      };
    }

    try {
      new WorkSchedule(agenda);
      return { valid: true };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }

  /**
   * Valida un adminId.
   * @param {number} adminId - ID del administrador
   * @returns {{ valid: boolean, message?: string }} Resultado de validación
   */
  static validateAdminId(adminId) {
    if (!adminId || typeof adminId !== 'number' || adminId <= 0) {
      return { valid: false, message: VerifierMessages.ADMIN_ID_REQUIRED };
    }
    return { valid: true };
  }

  /**
   * Valida todos los campos requeridos para crear un verificador.
   * @param {Object} data - Datos a validar
   * @returns {{ valid: boolean, errors: Object }} Resultado con todos los errores
   */
  static validateCreateVerifier(data) {
    const errors = {};

    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.valid) errors.email = emailValidation.message;

    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.valid) errors.password = passwordValidation.message;

    const nameValidation = this.validateName(data.name, 'Nombre');
    if (!nameValidation.valid) errors.name = nameValidation.message;

    const lastNameValidation = this.validateName(data.lastName, 'Apellido');
    if (!lastNameValidation.valid) errors.lastName = lastNameValidation.message;

    const phoneValidation = this.validatePhoneNumber(data.phoneNumber);
    if (!phoneValidation.valid) errors.phoneNumber = phoneValidation.message;

    const agendaValidation = this.validateAgenda(data.agenda);
    if (!agendaValidation.valid) errors.agenda = agendaValidation.message;

    const adminIdValidation = this.validateAdminId(data.adminId);
    if (!adminIdValidation.valid) errors.adminId = adminIdValidation.message;

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida todos los campos requeridos para actualizar un verificador.
   * @param {Object} data - Datos a validar
   * @returns {{ valid: boolean, errors: Object }} Resultado con todos los errores
   */
  static validateUpdateVerifier(data) {
    const errors = {};

    if (data.email !== undefined) {
      const emailValidation = this.validateEmail(data.email);
      if (!emailValidation.valid) errors.email = emailValidation.message;
    }

    if (data.name !== undefined) {
      const nameValidation = this.validateName(data.name, 'Nombre');
      if (!nameValidation.valid) errors.name = nameValidation.message;
    }

    if (data.lastName !== undefined) {
      const lastNameValidation = this.validateName(data.lastName, 'Apellido');
      if (!lastNameValidation.valid) errors.lastName = lastNameValidation.message;
    }

    if (data.phoneNumber !== undefined) {
      const phoneValidation = this.validatePhoneNumber(data.phoneNumber);
      if (!phoneValidation.valid) errors.phoneNumber = phoneValidation.message;
    }

    if (data.agenda !== undefined) {
      const agendaValidation = this.validateAgenda(data.agenda);
      if (!agendaValidation.valid) errors.agenda = agendaValidation.message;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}
