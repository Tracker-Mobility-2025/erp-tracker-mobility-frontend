// Customer API Service
// Infrastructure layer - HTTP client for customers

import http from '../../shared/services/http-common.js';

export class CustomerApiService {
    constructor() {
        this.endpoint = '/applicant-companies';
    }

    async getAll() {
        return await http.get(this.endpoint);
    }

    async getAllByAdminId(adminId) {
        return await http.get(`${this.endpoint}?adminId=${adminId}`);
    }

    async getById(id) {
        return await http.get(`${this.endpoint}/${id}`);
    }

    async create(customerData) {
        return await http.post(this.endpoint, customerData);
    }

    async update(id, customerData) {
        return await http.put(`${this.endpoint}/${id}`, customerData);
    }

    async delete(id) {
        return await http.delete(`${this.endpoint}/${id}`);
    }

    // Employee endpoints
    async getEmployeesByCustomerId(customerId) {
        return await http.get(`${this.endpoint}/${customerId}/employees`);
    }

    async createEmployee(customerId, employeeData) {
        return await http.post(`${this.endpoint}/${customerId}/employees`, employeeData);
    }

    async updateEmployee(customerId, employeeId, employeeData) {
        return await http.put(`${this.endpoint}/${customerId}/employees/${employeeId}`, employeeData);
    }

    async deleteEmployee(customerId, employeeId) {
        return await http.delete(`${this.endpoint}/${customerId}/employees/${employeeId}`);
    }
}
