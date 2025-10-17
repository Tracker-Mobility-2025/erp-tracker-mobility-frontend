import http from "../../../shared/services/http-common.js";


export class CompanyEmployeesService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // La ruta es la siguiente: /api/v1/order-request/applicant-company/{usernameEmployee}
    getApplicantCompanyByUsernameEmployee(usernameEmployee) {
        return http.get(`${this.resourceEndpoint}/by-username/${usernameEmployee}`);
    }

}