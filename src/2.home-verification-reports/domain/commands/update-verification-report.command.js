/**
 * Command para actualizar un reporte de verificación existente.
 * 
 * @class UpdateVerificationReportCommand
 */
export class UpdateVerificationReportCommand {
  constructor({
    id,
    verifierName,
    addressLocation,
    visitDate,
    finalResult,
    summary,
    observations
  }) {
    // Validaciones requeridas
    if (!id) {
      throw new Error('ID es requerido para actualizar');
    }

    // Asignación de propiedades
    this.id = id;
    this.verifierName = verifierName?.trim() || null;
    this.addressLocation = addressLocation?.trim() || null;
    this.visitDate = visitDate || null;
    this.finalResult = finalResult?.trim() || null;
    this.summary = summary?.trim() || null;
    this.observations = observations?.trim() || null;
  }
}
