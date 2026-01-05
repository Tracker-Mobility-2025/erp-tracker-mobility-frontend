/**
 * Customer Store - Application Layer
 * Pinia store con toda la lógica de negocio del módulo de clientes
 */
import { defineStore } from 'pinia';
import { CustomerHttpRepository } from '../infrastructure/repositories/customer-http.repository.js';
import { CreateCustomerCommand } from '../domain/commands/create-customer.command.js';
import { UpdateCustomerCommand } from '../domain/commands/update-customer.command.js';
import { CustomerErrorHandler } from './error-handlers/customer-error.handler.js';

const repository = new CustomerHttpRepository();
const errorHandler = new CustomerErrorHandler();

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customers: [],
        employees: [],
        currentCustomer: null,
        currentEmployee: null,
        loading: false,
        error: null
    }),

    getters: {
        /**
         * Clientes activos
         */
        activeCustomers: (state) => state.customers.filter(c => c.isActive()),

        /**
         * Clientes inactivos
         */
        inactiveCustomers: (state) => state.customers.filter(c => !c.isActive()),

        /**
         * Total de clientes
         */
        totalCustomers: (state) => state.customers.length,

        /**
         * Obtiene un cliente por ID
         */
        getCustomerById: (state) => (id) => state.customers.find(c => c.id === id),

        /**
         * Colaboradores activos del cliente actual
         */
        activeEmployees: (state) => state.employees.filter(e => e.isActive())
    },

    actions: {
        /**
         * Obtiene todos los clientes
         */
        async fetchAll() {
            this.loading = true;
            this.error = null;

            try {
                this.customers = await repository.findAll();
                console.log('✅ [STORE] Clientes cargados:', this.customers.length);
            } catch (error) {
                console.error('❌ [STORE] Error al cargar clientes:', error);
                this.error = errorHandler.handle(error, 'fetchAll');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Obtiene clientes por admin ID
         */
        async fetchByAdminId(adminId) {
            this.loading = true;
            this.error = null;

            try {
                this.customers = await repository.findAllByAdminId(adminId);
                console.log('✅ [STORE] Clientes del admin cargados:', this.customers.length);
            } catch (error) {
                console.error('❌ [STORE] Error al cargar clientes del admin:', error);
                this.error = errorHandler.handle(error, 'fetchByAdminId');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Obtiene un cliente por ID
         */
        async fetchById(id) {
            this.loading = true;
            this.error = null;

            try {
                this.currentCustomer = await repository.findById(id);
                console.log('✅ [STORE] Cliente cargado:', this.currentCustomer.companyName);
                return this.currentCustomer;
            } catch (error) {
                console.error('❌ [STORE] Error al cargar cliente:', error);
                this.error = errorHandler.handle(error, 'fetchById');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Crea un nuevo cliente
         */
        async create(customerData) {
            this.loading = true;
            this.error = null;

            try {
                const command = new CreateCustomerCommand(customerData);
                const newCustomer = await repository.save(command);
                
                this.customers.push(newCustomer);
                console.log('✅ [STORE] Cliente creado:', newCustomer.companyName);
                
                return newCustomer;
            } catch (error) {
                console.error('❌ [STORE] Error al crear cliente:', error);
                this.error = errorHandler.handle(error, 'create');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Actualiza un cliente existente
         */
        async update(customerData) {
            this.loading = true;
            this.error = null;

            try {
                const command = new UpdateCustomerCommand(customerData);
                const updatedCustomer = await repository.update(command);
                
                const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
                if (index !== -1) {
                    this.customers[index] = updatedCustomer;
                }
                
                console.log('✅ [STORE] Cliente actualizado:', updatedCustomer.companyName);
                return updatedCustomer;
            } catch (error) {
                console.error('❌ [STORE] Error al actualizar cliente:', error);
                this.error = errorHandler.handle(error, 'update');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Elimina un cliente
         */
        async delete(id) {
            this.loading = true;
            this.error = null;

            try {
                await repository.delete(id);
                
                this.customers = this.customers.filter(c => c.id !== id);
                console.log('✅ [STORE] Cliente eliminado:', id);
            } catch (error) {
                console.error('❌ [STORE] Error al eliminar cliente:', error);
                this.error = errorHandler.handle(error, 'delete');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Obtiene colaboradores de un cliente
         */
        async fetchEmployees(customerId) {
            this.loading = true;
            this.error = null;

            try {
                this.employees = await repository.findEmployeesByCustomerId(customerId);
                console.log('✅ [STORE] Colaboradores cargados:', this.employees.length);
            } catch (error) {
                console.error('❌ [STORE] Error al cargar colaboradores:', error);
                this.error = errorHandler.handle(error, 'fetchEmployees');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Crea un colaborador
         */
        async createEmployee(employeeData) {
            this.loading = true;
            this.error = null;

            try {
                const newEmployee = await repository.createEmployee(employeeData);
                this.employees.push(newEmployee);
                console.log('✅ [STORE] Colaborador creado:', newEmployee.getFullName());
                return newEmployee;
            } catch (error) {
                console.error('❌ [STORE] Error al crear colaborador:', error);
                this.error = errorHandler.handle(error, 'createEmployee');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Actualiza un colaborador
         */
        async updateEmployee(employeeId, employeeData) {
            this.loading = true;
            this.error = null;

            try {
                const updatedEmployee = await repository.updateEmployee(employeeId, employeeData);
                
                const index = this.employees.findIndex(e => e.id === employeeId);
                if (index !== -1) {
                    this.employees[index] = updatedEmployee;
                }
                
                console.log('✅ [STORE] Colaborador actualizado:', updatedEmployee.getFullName());
                return updatedEmployee;
            } catch (error) {
                console.error('❌ [STORE] Error al actualizar colaborador:', error);
                this.error = errorHandler.handle(error, 'updateEmployee');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Elimina un colaborador
         */
        async deleteEmployee(employeeId) {
            this.loading = true;
            this.error = null;

            try {
                await repository.deleteEmployee(employeeId);
                this.employees = this.employees.filter(e => e.id !== employeeId);
                console.log('✅ [STORE] Colaborador eliminado:', employeeId);
            } catch (error) {
                console.error('❌ [STORE] Error al eliminar colaborador:', error);
                this.error = errorHandler.handle(error, 'deleteEmployee');
                throw this.error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Limpia el estado
         */
        clearState() {
            this.customers = [];
            this.employees = [];
            this.currentCustomer = null;
            this.currentEmployee = null;
            this.error = null;
        }
    }
});

