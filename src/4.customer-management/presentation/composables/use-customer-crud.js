// Customer CRUD Composable
// Provides CRUD operations with UI feedback

import { useCustomerStore } from '../../application/customer.store.js';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

/**
 * Composable para gestionar operaciones CRUD de clientes.
 */
export function useCustomerCrud() {
    const customerStore = useCustomerStore();
    const toast = useToast();
    const confirm = useConfirm();

    /**
     * Create a new customer
     * @param {Object} customerData - Customer data
     * @returns {Promise<Customer>}
     */
    const createCustomer = async (customerData) => {
        console.log('[CRUD Composable] createCustomer called at', new Date().toISOString());
        const result = await customerStore.create(customerData);
        console.log('[CRUD Composable] create result:', result);
        
        if (result.success) {
            console.log('[CRUD Composable] Showing success toast for create');
            toast.add({
                severity: 'success',
                summary: 'Cliente creado',
                detail: `El cliente ${customerData.companyName} ha sido creado exitosamente`,
                life: 4000
            });
            return result.data;
        } else {
            console.log('[CRUD Composable] Showing error toast for create');
            toast.add({
                severity: 'error',
                summary: 'Error al crear',
                detail: result.message || 'No se pudo crear el cliente',
                life: 4000
            });
            throw new Error(result.message);
        }
    };

    /**
     * Update an existing customer
     * @param {Object} customerData - Customer data with id
     * @returns {Promise<Customer>}
     */
    const updateCustomer = async (customerData) => {
        console.log('[CRUD Composable] updateCustomer called at', new Date().toISOString());
        const result = await customerStore.update(customerData.id, customerData);
        console.log('[CRUD Composable] result:', result);
        
        if (result.success) {
            console.log('[CRUD Composable] Showing success toast');
            toast.add({
                severity: 'success',
                summary: 'Cliente actualizado',
                detail: `El cliente ${customerData.companyName} ha sido actualizado exitosamente`,
                life: 4000
            });
            return result.data;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error al actualizar',
                detail: result.message || 'No se pudo actualizar el cliente',
                life: 4000
            });
            throw new Error(result.message);
        }
    };

    /**
     * Delete a customer with confirmation
     * @param {Object} customer - Customer to delete
     * @returns {Promise<void>}
     */
    const deleteCustomer = (customer) => {
        return new Promise((resolve, reject) => {
            confirm.require({
                message: `¿Está seguro de eliminar el cliente ${customer.companyName}?`,
                header: 'Confirmación',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Cancelar',
                acceptLabel: 'Eliminar',
                acceptClass: 'p-button-danger',
                accept: async () => {
                    const result = await customerStore.delete(customer.id);
                    
                    if (result.success) {
                        toast.add({
                            severity: 'success',
                            summary: 'Cliente eliminado',
                            detail: 'El cliente ha sido eliminado exitosamente',
                            life: 4000
                        });
                        resolve();
                    } else {
                        toast.add({
                            severity: 'error',
                            summary: 'Error al eliminar',
                            detail: result.message || 'No se pudo eliminar el cliente',
                            life: 4000
                        });
                        reject(new Error(result.message));
                    }
                },
                reject: () => {
                    resolve(); // Resolve on cancel (no error)
                }
            });
        });
    };

    /**
     * Fetch all customers
     * @returns {Promise<Array<Customer>>}
     */
    const fetchAllCustomers = async () => {
        try {
            return await customerStore.fetchAll();
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error al cargar',
                detail: error.message || 'No se pudieron cargar los clientes',
                life: 4000
            });
            throw error;
        }
    };

    /**
     * Fetch customer by ID
     * @param {number} id - Customer ID
     * @returns {Promise<Customer>}
     */
    const fetchCustomerById = async (id) => {
        try {
            return await customerStore.fetchById(id);
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error al cargar',
                detail: error.message || 'No se pudo cargar el cliente',
                life: 4000
            });
            throw error;
        }
    };

    return {
        createCustomer,
        updateCustomer,
        deleteCustomer,
        fetchAllCustomers,
        fetchCustomerById
    };
}
