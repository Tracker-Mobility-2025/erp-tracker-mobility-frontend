import http from "../../../shared/services/http-common.js";


export class EmployeeClientTrackerApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retornar todos los empleados de un cliente especifico
    getAllByClient(clientId) {
        return http.get(`${this.resourceEndpoint}/${clientId}`);
    }

    // Crear nuevo empleado para un cliente especifico
    create(data) {
        return http.post(this.resourceEndpoint, data);
    }

    // Actualizar empleado por Id
    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    // Eliminar empleado por Id
    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }


    // Retornar empleado por Id
    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }



}

