import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { CustomerApi } from '../customer.api.js';
import { CustomerAssembler, EmployeeCollaboratorAssembler } from '../assemblers/customer.assembler.js';
import { CreateCustomerCommand } from '../../domain/commands/create-customer.command.js';
import { UpdateCustomerCommand } from '../../domain/commands/update-customer.command.js';

/**
 * Implementación HTTP del repositorio de clientes.
 * Adaptador que conecta el dominio con la API REST.
 * 
 * @class CustomerHttpRepository
 * @extends {ICustomerRepository}
 */
export class CustomerHttpRepository extends ICustomerRepository {
    #api;

    constructor() {
        super();
        this.#api = new CustomerApi();
    }

    /**
     * Get all customers
     * @returns {Promise<Array<Customer>>}
     */
    async findAll() {
        const response = await this.#api.getCustomers();
        return CustomerAssembler.toDomainCollection(response.data);
    }

    /**
     * Get customers by admin ID
     * @param {number} adminId - Admin user ID
     * @returns {Promise<Array<Customer>>}
     */
    async findByAdminId(adminId) {
        const response = await this.#api.getCustomersByAdminId(adminId);
        return CustomerAssembler.toDomainCollection(response.data);
    }

    /**
     * Get customer by ID
     * @param {number} id - Customer ID
     * @returns {Promise<Customer>}
     */
    async findById(id) {
        const response = await this.#api.getCustomerById(id);
        return CustomerAssembler.toDomain(response.data);
    }

    /**
     * Create new customer
     * @param {CreateCustomerCommand} command - Create customer command
     * @returns {Promise<Customer>}
     */
    async create(command) {
        const response = await this.#api.createCustomer(command);
        return CustomerAssembler.toDomain(response.data);
    }

    /**
     * Update existing customer
     * @param {number} id - Customer ID
     * @param {UpdateCustomerCommand} command - Update customer command
     * @returns {Promise<Customer>}
     */
    async update(id, command) {
        const response = await this.#api.updateCustomer(command);
        return CustomerAssembler.toDomain(response.data);
    }

    /**
     * Delete customer by ID
     * @param {number} id - Customer ID
     * @returns {Promise<void>}
     */
    async delete(id) {
        await this.#api.deleteCustomer(id);
    }

    // ========== Employee Methods ==========

    /**
     * Get employees by customer ID
     * @param {number} customerId - Customer ID
     * @returns {Promise<Array<EmployeeCollaborator>>}
     */
    async findEmployeesByCustomerId(customerId) {
        const response = await this.#api.getEmployeesByCustomerId(customerId);
        return EmployeeCollaboratorAssembler.toDomainCollection(response.data);
    }

    /**
     * Create new employee for customer
     * @param {number} customerId - Customer ID
     * @param {Object} employeeData - Employee data
     * @returns {Promise<EmployeeCollaborator>}
     */
    async createEmployee(customerId, employeeData) {
        const response = await this.#api.createEmployee(employeeData);
        return EmployeeCollaboratorAssembler.toDomain(response.data);
    }

    /**
     * Update existing employee
     * @param {number} customerId - Customer ID
     * @param {number} employeeId - Employee ID
     * @param {Object} employeeData - Employee data
     * @returns {Promise<EmployeeCollaborator>}
     */
    async updateEmployee(customerId, employeeId, employeeData) {
        const response = await this.#api.updateEmployee(employeeId, employeeData);
        return EmployeeCollaboratorAssembler.toDomain(response.data);
    }

    /**
     * Delete employee
     * @param {number} customerId - Customer ID
     * @param {number} employeeId - Employee ID
     * @returns {Promise<void>}
     */
    async deleteEmployee(customerId, employeeId) {
        await this.#api.deleteEmployee(employeeId);
    }
}