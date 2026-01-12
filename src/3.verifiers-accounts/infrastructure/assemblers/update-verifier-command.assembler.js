/**
 * Assembler para convertir UpdateVerifierCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * Responsabilidad: Serializar Commands del dominio al formato esperado por la API.
 * 
 * @class UpdateVerifierCommandAssembler
 */
export class UpdateVerifierCommandAssembler {
    
    /**
     * Convierte un UpdateVerifierCommand a un objeto resource para la API.
     * @param {UpdateVerifierCommand} command - El comando de actualización de verificador.
     * @returns {Object} El objeto resource formateado para la API.
     */
    static toResource(command) {
        const resource = {
            id: command.id
        };

        // Solo incluir campos que están presentes en el comando
        if (command.email !== undefined) {
            resource.email = command.email?.value || command.email;
        }
        if (command.name !== undefined) resource.name = command.name;
        if (command.lastName !== undefined) resource.lastName = command.lastName;
        if (command.phoneNumber !== undefined) {
            resource.phoneNumber = command.phoneNumber?.value || command.phoneNumber;
        }
        if (command.agenda !== undefined) resource.agenda = command.agenda;
        if (command.status !== undefined) resource.status = command.status;
        if (command.role !== undefined) resource.role = command.role;
        if (command.password !== undefined) resource.password = command.password;

        return resource;
    }
    
    /**
     * Alias para compatibilidad con código existente.
     * @deprecated Usar toResource() en su lugar
     */
    static toResourceFromCommand(command) {
        return this.toResource(command);
    }
}
