import axios from "axios";

const http = axios.create({baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1"});


export class OrderService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    create(data) {
        return http.post(this.resourceEndpoint, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

}