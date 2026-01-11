import { BaseApi } from "../../shared-v2/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared-v2/infrastructure/base-endpoint.js";
import { CreateCustomerCommandAssembler } from "./assemblers/create-customer-command.assembler.js";
import { UpdateCustomerCommandAssembler } from "./assemblers/update-customer-command.assembler.js";

const customerEndpointPath = '/applicant-companies';
const employeeEndpointPath = '/company-employees';

/**
 * Servicio API para gestionar recursos de Customer.
 * Extiende BaseApi para proporcionar operaciones CRUD para clientes y sus colaboradores.
 * 
 * @class CustomerApi
 * @extends {BaseApi}
 */
export class CustomerApi extends BaseApi {

    #customerEndpoint;

    constructor() {
        super();
        this.#customerEndpoint = new BaseEndpoint(this, customerEndpointPath);
    }

    /**
     * Obtiene todos los clientes desde la API.
     * @returns {Promise} Una promesa que se resuelve con la respuesta de clientes.
     */
    getCustomers() {
        return this.#customerEndpoint.getAll();
    }

    /**
     * Obtiene un cliente por ID.
     * @param {string|number} id - El ID del cliente.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del cliente.
     */
    getCustomerById(id) {
        return this.#customerEndpoint.getById(id);
    }

    /**
     * Obtiene todos los clientes asociados a un administrador específico.
     * @param {string|number} adminId - El ID del administrador.
     * @returns {Promise} Una promesa que se resuelve con la respuesta de clientes del admin.
     */
    getCustomersByAdminId(adminId) {
        return this.http.get(`${customerEndpointPath}?adminId=${adminId}`);
    }

    /**
     * Crea un nuevo cliente usando un CreateCustomerCommand.
     * @param {CreateCustomerCommand} command - El comando de creación de cliente.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del cliente creado.
     */
    createCustomer(command) {
        const resource = CreateCustomerCommandAssembler.toResourceFromCommand(command);
        console.log('[API] Creating customer with resource:', resource);
        return this.#customerEndpoint.create(resource);
    }

    /**
     * Actualiza un cliente existente usando un UpdateCustomerCommand.
     * @param {UpdateCustomerCommand} command - El comando de actualización de cliente.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del cliente actualizado.
     */
    updateCustomer(command) {
        console.log('🔍 [API] UpdateCustomerCommand recibido:', command);
        console.log('🔍 [API] command.brands:', command.brands);
        const resource = UpdateCustomerCommandAssembler.toResourceFromCommand(command);
        console.log('🔍 [API] Resource para PATCH:', JSON.stringify(resource, null, 2));
        // Usar PATCH en lugar de PUT (BaseEndpoint.update usa PUT)
        return this.http.patch(`${customerEndpointPath}/${command.id}`, resource);
    }

    /**
     * Elimina un cliente por ID.
     * @param {string|number} id - El ID del cliente a eliminar.
     * @returns {Promise} Una promesa que se resuelve cuando el cliente es eliminado.
     */
    deleteCustomer(id) {
        return this.#customerEndpoint.delete(id);
    }

    // ========== Employee Endpoints ==========

    /**
     * Obtiene todos los colaboradores de un cliente específico.
     * @param {string|number} customerId - El ID del cliente.
     * @returns {Promise} Una promesa que se resuelve con los colaboradores del cliente.
     */
    getEmployeesByCustomerId(customerId) {
        return this.http.get(`${employeeEndpointPath}/applicant-company/${customerId}`);
    }

    /**
     * Crea un nuevo colaborador para un cliente.
     * @param {Object} employeeData - Los datos del colaborador.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del colaborador creado.
     */
    async createEmployee(employeeData) {
        console.log('🎯 [API] POST /company-employees');
        console.log('📦 [API] Payload:', JSON.stringify(employeeData, null, 2));
        console.log('✅ [API] Campos esperados validados:', {
            email: !!employeeData.email,
            password: !!employeeData.password,
            name: !!employeeData.name,
            lastName: !!employeeData.lastName,
            phoneNumber: !!employeeData.phoneNumber,
            applicantCompanyId: !!employeeData.applicantCompanyId,
            brandId: !!employeeData.brandId,
            role: !!employeeData.role
        });
        
        try {
            const response = await this.http.post(employeeEndpointPath, employeeData);
            console.log('✅ [API] Respuesta exitosa:', response.data);
            return response;
        } catch (error) {
            console.error('❌ [API] Error en POST /company-employees');
            console.error('🔴 [API] Status:', error.response?.status);
            console.error('📝 [API] Mensaje del backend:', error.response?.data);
            console.error('📝 [API] Headers de respuesta:', error.response?.headers);
            console.error('📦 [API] Payload que causó el error:', JSON.stringify(employeeData, null, 2));
            throw error; // Re-lanzar para que el store lo maneje
        }
    }

    /**
     * Actualiza un colaborador existente.
     * @param {string|number} employeeId - El ID del colaborador.
     * @param {Object} employeeData - Los datos actualizados del colaborador.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del colaborador actualizado.
     */
    updateEmployee(employeeId, employeeData) {
        return this.http.patch(`${employeeEndpointPath}/${employeeId}`, employeeData);
    }

    /**
     * Elimina un colaborador por ID.
     * @param {string|number} employeeId - El ID del colaborador a eliminar.
     * @returns {Promise} Una promesa que se resuelve cuando el colaborador es eliminado.
     */
    deleteEmployee(employeeId) {
        return this.http.delete(`${employeeEndpointPath}/${employeeId}`);
    }
}
