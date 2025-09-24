import axios from 'axios';

const http = axios.create({baseURL: "https://my-json-server.typicode.com/SV51-MetaSoft-App-Web/endpoint-winemaking-process"});

export default {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    },


    getAll() {

    },

    getResourceById(id) {

    }





}