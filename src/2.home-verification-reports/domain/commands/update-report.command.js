/**
 * Command para actualizar un reporte de verificación.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class UpdateReportCommand
 */
export class UpdateReportCommand {
  constructor({
    reportId,
    finalResult,
    summary,
    observations,
    glossary,
    casuistics,
    isResultValid
  }) {
    // Validaciones requeridas
    if (!reportId) {
      throw new Error('El ID del reporte es requerido');
    }
    if (!finalResult || finalResult.trim() === '') {
      throw new Error('El resultado final es requerido');
    }
    
    // Validar que finalResult sea uno de los valores permitidos
    const validResults = ['CONFORME', 'OBSERVADO', 'RECHAZADO'];
    if (!validResults.includes(finalResult)) {
      throw new Error(`El resultado final debe ser uno de: ${validResults.join(', ')}`);
    }

    // Asignación de propiedades
    this.reportId = reportId;
    this.finalResult = finalResult.trim();
    this.summary = summary?.trim() || '';
    
    // Procesar observations: pueden ser strings u objetos con {id, value}
    this.observations = Array.isArray(observations) 
      ? observations
          .map(o => typeof o === 'string' ? o : o?.value)
          .filter(o => o && typeof o === 'string' && o.trim() !== '')
      : [];
    
    // Procesar glossary: pueden ser strings u objetos con {id, value}
    this.glossary = Array.isArray(glossary) 
      ? glossary
          .map(g => typeof g === 'string' ? g : g?.value)
          .filter(g => g && typeof g === 'string' && g.trim() !== '')
      : [];
    
    // Procesar casuistics: pueden ser strings u objetos con {id, value}
    this.casuistics = Array.isArray(casuistics) 
      ? casuistics
          .map(c => typeof c === 'string' ? c : c?.value)
          .filter(c => c && typeof c === 'string' && c.trim() !== '')
      : [];
    
    this.isResultValid = isResultValid === true; // Asegurar boolean
  }
}
