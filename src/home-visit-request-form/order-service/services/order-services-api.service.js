import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/api/orders",
  headers: {
    "Content-type": "application/json",
  },
});

export class OrderService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    create(data) {
        return http.post(this.resourceEndpoint, data);
    }

}