import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { CustomerApiService } from '../customer.api.js';
import { CustomerAssembler, EmployeeCollaboratorAssembler } from '../customer.assembler.js';
import { CreateCustomerCommandAssembler } from '../create-customer-command.assembler.js';
import { UpdateCustomerCommandAssembler } from '../update-customer-command.assembler.js';

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
        this.#api = new CustomerApiService();
    }

    /**
     * Get all customers
     * @returns {Promise<Array<Customer>>}
     */
    async findAll() {
        const response = await this.#api.getAll();
        return CustomerAssembler.toDomainCollection(response.data);
    }

    /**
     * Get customers by admin ID
     * @param {number} adminId - Admin user ID
     * @returns {Promise<Array<Customer>>}
     */
    async findAllByAdminId(adminId) {
        const response = await this.#api.getAllByAdminId(adminId);
        return CustomerAssembler.toDomainCollection(response.data);
    }

    /**
     * Get customer by ID
     * @param {number} id - Customer ID
     * @returns {Promise<Customer>}
     */
    async findById(id) {
        const response = await this.#api.getById(id);
        return CustomerAssembler.toDomain(response.data);
    }

    /**
     * Create new customer
     * @param {CreateCustomerCommand} command - Create customer command
     * @returns {Promise<Customer>}
     */
    async save(command) {
        const dto = CreateCustomerCommandAssembler.toResource(command);
        const response = await this.#api.create(dto);
        return CustomerAssembler.toDomain(response.data);
    }

    /**
     * Update existing customer
     * @param {UpdateCustomerCommand} command - Update customer command
     * @returns {Promise<Customer>}
     */
    async update(command) {
        const dto = UpdateCustomerCommandAssembler.toResource(command);
        const response = await this.#api.update(command.id, dto);
        return CustomerAssembler.toDomain(response.data);
    }

    /**
     * Delete customer by ID
     * @param {number} id - Customer ID
     * @returns {Promise<void>}
     */
    async delete(id) {
        await this.#api.delete(id);
    }

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
     * @param {Object} employeeData - Employee data
     * @returns {Promise<EmployeeCollaborator>}
     */
    async createEmployee(employeeData) {
        const { applicantCompanyId, ...data } = employeeData;
        const response = await this.#api.createEmployee(applicantCompanyId, data);
        return EmployeeCollaboratorAssembler.toDomain(response.data);
    }

    /**
     * Update existing employee
     * @param {number} employeeId - Employee ID
     * @param {Object} employeeData - Employee data
     * @returns {Promise<EmployeeCollaborator>}
     */
    async updateEmployee(employeeId, employeeData) {
        const { applicantCompanyId, ...data } = employeeData;
        const response = await this.#api.updateEmployee(applicantCompanyId, employeeId, data);
        return EmployeeCollaboratorAssembler.toDomain(response.data);
    }

    /**
     * Delete employee
     * @param {number} employeeId - Employee ID
     * @returns {Promise<void>}
     */
    async deleteEmployee(employeeId) {
        // Extract customer ID from employee data if needed
        // For now, assume it's available in the context
        const employee = this.employees?.find(e => e.id === employeeId);
        if (employee) {
            await this.#api.deleteEmployee(employee.applicantCompanyId, employeeId);
        } else {
            throw new Error('Employee not found or customer ID not available');
        }
    }
}

