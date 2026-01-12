/**
 * Value Object para WorkSchedule (Agenda)
 * Encapsula el horario de trabajo del verificador.
 * 
 * @class WorkSchedule
 */
export class WorkSchedule {
  /**
   * Crea una instancia de WorkSchedule.
   * @param {string} value - Horario de trabajo (ej: "Lunes a Viernes 8:00-17:00")
   * @throws {Error} Si el horario es inválido
   */
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('El horario de trabajo es requerido');
    }

    const trimmed = value.trim();
    
    if (trimmed.length < 3) {
      throw new Error('Horario de trabajo inválido');
    }

    this.value = trimmed;
  }

  /**
   * Parsea el horario para extraer días y horas
   * @returns {Object} Objeto con días y horario
   */
  get parsed() {
    const parts = this.value.split(/\s+/);
    
    return {
      raw: this.value,
      days: parts.slice(0, -1).join(' '),
      hours: parts[parts.length - 1] || ''
    };
  }

  /**
   * Verifica si trabaja en un día específico
   * @param {Date} date - Fecha a verificar
   * @returns {boolean} True si el día está en el horario
   */
  isAvailableOn(date) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = dayNames[date.getDay()];
    return this.value.toLowerCase().includes(dayName.toLowerCase());
  }

  /**
   * Verifica si trabaja fines de semana
   * @returns {boolean} True si trabaja sábado o domingo
   */
  get worksOnWeekends() {
    const lower = this.value.toLowerCase();
    return lower.includes('sábado') || lower.includes('sabado') || lower.includes('domingo');
  }

  /**
   * Convierte a string
   * @returns {string} Horario de trabajo
   */
  toString() {
    return this.value;
  }
}
