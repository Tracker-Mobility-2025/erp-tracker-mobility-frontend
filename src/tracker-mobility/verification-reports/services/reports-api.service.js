import axios from "axios";

const http = axios.create({baseURL: "http://localhost:3000/api"});


export class ReportsApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(data) {
        return http.post(this.resourceEndpoint, data);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

}