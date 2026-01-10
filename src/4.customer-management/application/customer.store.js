/**
 * Customer Store - Application Layer
 * Pinia store con toda la lógica de negocio del módulo de clientes
 * Usa Composition API para poder acceder a composables de Vue
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CustomerHttpRepository } from '../infrastructure/repositories/customer-http.repository.js';
import { CreateCustomerCommand } from '../domain/commands/create-customer.command.js';
import { UpdateCustomerCommand } from '../domain/commands/update-customer.command.js';
import { CustomerErrorHandler } from './error-handlers/customer-error.handler.js';
import { useNotification } from '../../shared-v2/composables/use-notification.js';

/**
 * Store de Pinia para funcionalidad de clientes.
 * Arquitectura: Presentation → Store → Repository → API
 * El Store contiene la lógica de negocio y gestiona estado reactivo.
 */
export const useCustomerStore = defineStore('customer', () => {
    // State
    const customers = ref([]);
    const employees = ref([]);
    const currentCustomer = ref(null);
    const currentEmployee = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Dependencies
    const repository = new CustomerHttpRepository();
    const { showSuccess, showError, showWarning } = useNotification();
    const errorHandler = new CustomerErrorHandler({ showSuccess, showError, showWarning });

    // Getters
    /**
     * Clientes activos
     */
    const activeCustomers = computed(() => customers.value.filter(c => c.isActive()));

    /**
     * Clientes inactivos
     */
    const inactiveCustomers = computed(() => customers.value.filter(c => !c.isActive()));

    /**
     * Total de clientes
     */
    const totalCustomers = computed(() => customers.value.length);

    /**
     * Obtiene un cliente por ID
     */
    const getCustomerById = computed(() => (id) => customers.value.find(c => c.id === id));

    /**
     * Colaboradores activos del cliente actual
     */
    const activeEmployees = computed(() => employees.value.filter(e => e.isActive()));

    // Actions

    /**
     * Obtiene todos los clientes
     */
    async function fetchAll() {
        // Limpiar datos SÍNCRONAMENTE antes de cargar
        customers.value = [];
        
        loading.value = true;
        error.value = null;

        try {
            customers.value = await repository.findAll();
            return {
                success: true,
                data: customers.value,
                message: `${customers.value.length} cliente${customers.value.length !== 1 ? 's' : ''} cargado${customers.value.length !== 1 ? 's' : ''}`,
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'fetchAll');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Obtiene los clientes de un administrador específico
     */
    async function fetchByAdminId(adminId) {
        loading.value = true;
        error.value = null;

        try {
            if (!adminId) {
                return {
                    success: false,
                    message: 'ID de administrador requerido',
                    code: 'INVALID_PARAMS'
                };
            }

            customers.value = await repository.findByAdminId(adminId);
            return {
                success: true,
                data: customers.value,
                message: `${customers.value.length} cliente${customers.value.length !== 1 ? 's' : ''} cargado${customers.value.length !== 1 ? 's' : ''}`,
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'fetchByAdminId');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Obtiene un cliente por su ID
     */
    async function fetchById(id) {
        // Limpiar datos anteriores primero
        currentCustomer.value = null;
        
        loading.value = true;
        error.value = null;

        try {
            const customerId = parseInt(id);

            if (!customerId) {
                return {
                    success: false,
                    message: 'ID de cliente requerido',
                    code: 'INVALID_PARAMS'
                };
            }

            currentCustomer.value = await repository.findById(customerId);

            if (!currentCustomer.value) {
                showWarning('Cliente no encontrado', 'No encontrado', 3000);
                return {
                    success: false,
                    message: 'Cliente no encontrado',
                    code: 'NOT_FOUND'
                };
            }

            return {
                success: true,
                data: currentCustomer.value,
                message: 'Cliente cargado exitosamente',
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'fetchById');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Crea un nuevo cliente
     */
    async function create(data) {
        console.log('[Store] create called at', new Date().toISOString(), 'data:', data);
        loading.value = true;
        error.value = null;

        try {
            console.log('[Store] Creating command with data:', data);
            const command = new CreateCustomerCommand(data);
            console.log('[Store] Command created:', command);
            const newCustomer = await repository.create(command);
            console.log('[Store] customer created successfully');
            
            customers.value.push(newCustomer);

            console.log('[Store] Returning success result for create');
            return {
                success: true,
                data: newCustomer,
                message: 'Cliente creado exitosamente',
                code: 'SUCCESS'
            };
        } catch (err) {
            console.log('[Store] Error in create, handling error');
            error.value = errorHandler.handle(err, 'create');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Actualiza un cliente existente
     */
    async function update(id, data) {
        console.log('🔍 [Store] update called - id:', id);
        console.log('🔍 [Store] data recibida:', JSON.stringify(data, null, 2));
        loading.value = true;
        error.value = null;

        try {
            const command = new UpdateCustomerCommand({ id, ...data });
            console.log('🔍 [Store] UpdateCustomerCommand creado:', command);
            console.log('🔍 [Store] command.brands:', command.brands);
            const updatedCustomer = await repository.update(id, command);
            console.log('[Store] customer updated successfully');

            // Actualizar el cliente en la lista
            const index = customers.value.findIndex(c => c.id === id);
            if (index !== -1) {
                customers.value[index] = updatedCustomer;
            }

            // Actualizar currentCustomer si es el mismo
            if (currentCustomer.value?.id === id) {
                currentCustomer.value = updatedCustomer;
            }

            console.log('[Store] Returning success result');
            return {
                success: true,
                data: updatedCustomer,
                message: 'Cliente actualizado exitosamente',
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'update');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Elimina un cliente
     */
    async function deleteCustomer(id) {
        loading.value = true;
        error.value = null;

        try {
            await repository.delete(id);

            // Eliminar de la lista
            customers.value = customers.value.filter(c => c.id !== id);

            // Limpiar currentCustomer si es el mismo
            if (currentCustomer.value?.id === id) {
                currentCustomer.value = null;
            }

            return {
                success: true,
                message: 'Cliente eliminado exitosamente',
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'delete');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Obtiene los colaboradores de un cliente
     */
    async function fetchEmployees(customerId) {
        // Limpiar datos anteriores primero
        employees.value = [];
        
        loading.value = true;
        error.value = null;

        try {
            if (!customerId) {
                return {
                    success: false,
                    message: 'ID de cliente requerido',
                    code: 'INVALID_PARAMS'
                };
            }

            employees.value = await repository.findEmployeesByCustomerId(customerId);

            return {
                success: true,
                data: employees.value,
                message: `${employees.value.length} colaborador${employees.value.length !== 1 ? 'es' : ''} cargado${employees.value.length !== 1 ? 's' : ''}`,
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'fetchEmployees');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Crea un nuevo colaborador para un cliente
     */
    async function createEmployee(customerId, employeeData) {
        loading.value = true;
        error.value = null;

        try {
            if (!customerId) {
                return {
                    success: false,
                    message: 'ID de cliente requerido',
                    code: 'INVALID_PARAMS'
                };
            }

            const newEmployee = await repository.createEmployee(customerId, employeeData);
            employees.value.push(newEmployee);

            return {
                success: true,
                data: newEmployee,
                message: 'Colaborador creado exitosamente',
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'createEmployee');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Actualiza un colaborador existente
     */
    async function updateEmployee(customerId, employeeId, employeeData) {
        loading.value = true;
        error.value = null;

        try {
            if (!customerId || !employeeId) {
                return {
                    success: false,
                    message: 'ID de cliente y colaborador requeridos',
                    code: 'INVALID_PARAMS'
                };
            }

            const updatedEmployee = await repository.updateEmployee(customerId, employeeId, employeeData);

            // Actualizar en la lista
            const index = employees.value.findIndex(e => e.id === employeeId);
            if (index !== -1) {
                employees.value[index] = updatedEmployee;
            }

            // Actualizar currentEmployee si es el mismo
            if (currentEmployee.value?.id === employeeId) {
                currentEmployee.value = updatedEmployee;
            }

            return {
                success: true,
                data: updatedEmployee,
                message: 'Colaborador actualizado exitosamente',
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'updateEmployee');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Elimina un colaborador
     */
    async function deleteEmployee(customerId, employeeId) {
        loading.value = true;
        error.value = null;

        try {
            if (!customerId || !employeeId) {
                return {
                    success: false,
                    message: 'ID de cliente y colaborador requeridos',
                    code: 'INVALID_PARAMS'
                };
            }

            await repository.deleteEmployee(customerId, employeeId);

            // Eliminar de la lista
            employees.value = employees.value.filter(e => e.id !== employeeId);

            // Limpiar currentEmployee si es el mismo
            if (currentEmployee.value?.id === employeeId) {
                currentEmployee.value = null;
            }

            return {
                success: true,
                message: 'Colaborador eliminado exitosamente',
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = errorHandler.handle(err, 'deleteEmployee');
            return error.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Limpia el estado del store
     */
    function clearState() {
        customers.value = [];
        employees.value = [];
        currentCustomer.value = null;
        currentEmployee.value = null;
        loading.value = false;
        error.value = null;
    }

    // Return
    return {
        // State
        customers,
        employees,
        currentCustomer,
        currentEmployee,
        loading,
        error,
        // Getters
        activeCustomers,
        inactiveCustomers,
        totalCustomers,
        getCustomerById,
        activeEmployees,
        // Actions
        fetchAll,
        fetchByAdminId,
        fetchById,
        create,
        update,
        delete: deleteCustomer,
        fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        clearState
    };
});

