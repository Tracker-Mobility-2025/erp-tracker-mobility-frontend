/**
 * Assembler para convertir CreateVerifierCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * 
 * @class CreateVerifierCommandAssembler
 */
export class CreateVerifierCommandAssembler {
    
    /**
     * Convierte un CreateVerifierCommand a un objeto resource para la API.
     * @param {CreateVerifierCommand} command - El comando de creación de verificador.
     * @returns {Object} El objeto resource formateado para la API.
     */
    static toResourceFromCommand(command) {
        return {
            email: command.email,
            password: command.password,
            name: command.name,
            lastName: command.lastName,
            phoneNumber: command.phoneNumber,
            agenda: command.workSchedule || command.agenda,
            adminId: command.adminId,
            role: command.role,
            status: command.status
        };
    }
}
