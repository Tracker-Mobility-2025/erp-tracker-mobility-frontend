import axios from "axios";

const http = axios.create({baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1"});


export class CompanyEmployeesService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // La ruta es la siguiente: /api/v1/order-request/applicant-company/{usernameEmployee}
    getApplicantCompanyByUsernameEmployee(usernameEmployee) {
        return http.get(`${this.resourceEndpoint}/by-username/${usernameEmployee}`);
    }

}