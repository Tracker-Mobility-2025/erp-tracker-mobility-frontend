import { SalesTeamApi } from "../sales-team.api.js";
import { SalesTeamAssembler } from "../assemblers/sales-team.assembler.js";

/**
 * Repositorio HTTP para el equipo de ventas.
 * Implementa la interfaz del dominio usando la API.
 */
export class SalesTeamHttpRepository {
    #api;

    constructor() {
        this.#api = new SalesTeamApi();
    }

    /**
     * Obtiene el empleado actual por ID de usuario.
     * @param {number} userId - ID del usuario autenticado.
     * @returns {Promise<Object>} Datos del empleado transformados.
     */
    async getEmployeeByUserId(userId) {
        try {
            const response = await this.#api.getEmployeeByUserId(userId);
            
            // Log de datos crudos del API
            console.log('📥 [SalesTeamRepository] Datos crudos del API:', response.data);
            
            const employee = SalesTeamAssembler.toEmployeeDomain(response.data);
            
            console.log('📦 [SalesTeamRepository] Empleado transformado:', {
                id: employee.id,
                name: employee.name,
                brandId: employee.brandId,
                brandName: employee.brandName,
                applicantCompanyId: employee.applicantCompanyId,
                applicantCompanyName: employee.applicantCompanyName
            });
            
            return employee;
        } catch (error) {
            console.error('[SalesTeamRepository] Error al obtener empleado por userId:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los empleados de una marca.
     * @param {number} brandId - ID de la marca.
     * @returns {Promise<Array>} Lista de empleados transformados.
     */
    async getEmployeesByBrandId(brandId) {
        try {
            const response = await this.#api.getEmployeesByBrandId(brandId);
            const employees = SalesTeamAssembler.toEmployeeDomainCollection(response.data);
            
            console.log(`📦 [SalesTeamRepository] ${employees.length} empleados transformados`);
            
            return employees;
        } catch (error) {
            console.error('[SalesTeamRepository] Error al obtener empleados por brandId:', error);
            throw error;
        }
    }

    /**
     * Obtiene las órdenes de un empleado.
     * @param {number} employeeId - ID del empleado.
     * @returns {Promise<Array>} Lista de órdenes del empleado.
     */
    async getEmployeeOrders(employeeId) {
        try {
            const response = await this.#api.getEmployeeOrders(employeeId);
            return response.data;
        } catch (error) {
            console.error('[SalesTeamRepository] Error al obtener órdenes del empleado:', error);
            throw error;
        }
    }

    /**
     * Obtiene el detalle de una orden.
     * @param {number} orderId - ID de la orden.
     * @returns {Promise<Object>} Detalle de la orden.
     */
    async getOrderDetail(orderId) {
        try {
            const response = await this.#api.getOrderDetail(orderId);
            return response.data;
        } catch (error) {
            console.error('[SalesTeamRepository] Error al obtener detalle de orden:', error);
            throw error;
        }
    }
}
