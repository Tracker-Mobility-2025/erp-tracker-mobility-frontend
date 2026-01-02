/**
 * Assembler para convertir UpdateVerifierCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * 
 * @class UpdateVerifierCommandAssembler
 */
export class UpdateVerifierCommandAssembler {
    
    /**
     * Convierte un UpdateVerifierCommand a un objeto resource para la API.
     * @param {UpdateVerifierCommand} command - El comando de actualización de verificador.
     * @returns {Object} El objeto resource formateado para la API.
     */
    static toResourceFromCommand(command) {
        const resource = {
            id: command.id
        };

        // Solo incluir campos que están presentes en el comando
        if (command.email !== undefined) resource.email = command.email;
        if (command.name !== undefined) resource.name = command.name;
        if (command.lastName !== undefined) resource.lastName = command.lastName;
        if (command.phoneNumber !== undefined) resource.phoneNumber = command.phoneNumber;
        if (command.workSchedule !== undefined) resource.agenda = command.workSchedule;
        if (command.agenda !== undefined) resource.agenda = command.agenda;
        if (command.status !== undefined) resource.status = command.status;
        if (command.role !== undefined) resource.role = command.role;

        return resource;
    }
}
