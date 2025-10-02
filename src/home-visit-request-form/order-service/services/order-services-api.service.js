import axios from "axios";

const http = axios.create({baseURL: "http://localhost:3000/api"});


export class OrderService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    create(data) {
        return http.post(this.resourceEndpoint, data);
    }

}