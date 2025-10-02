import axios from 'axios';

const http = axios.create({baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1"});


export class VerifierApi {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }


}