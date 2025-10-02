import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/orders",
    headers: {
        "Content-type": "application/json",
    },
});


