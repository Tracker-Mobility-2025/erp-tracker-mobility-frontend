/**
 * Assembler para convertir CreateVerifierCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * Responsabilidad: Serializar Commands del dominio al formato esperado por la API.
 * 
 * @class CreateVerifierCommandAssembler
 */
export class CreateVerifierCommandAssembler {
    
    /**
     * Convierte un CreateVerifierCommand a un objeto resource para la API.
     * @param {CreateVerifierCommand} command - El comando de creación de verificador.
     * @returns {Object} El objeto resource formateado para la API.
     */
    static toResource(command) {
        return {
            email: command.email?.value || command.email,
            password: command.password,
            name: command.name,
            lastName: command.lastName,
            phoneNumber: command.phoneNumber?.value || command.phoneNumber,
            agenda: command.agenda,
            adminId: command.adminId,
            role: command.role,
            status: command.status
        };
    }
    
    /**
     * Alias para compatibilidad con código existente.
     * @deprecated Usar toResource() en su lugar
     */
    static toResourceFromCommand(command) {
        return this.toResource(command);
    }
}
