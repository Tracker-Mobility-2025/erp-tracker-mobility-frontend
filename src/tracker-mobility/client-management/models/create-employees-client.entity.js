
export class CreateEmployeeClient {

    constructor(
        {
            email = "",
            password = "",
            name = "",
            lastName = "",
            applicantCompanyId = null
        }
    )
    {
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.applicantCompanyId = applicantCompanyId;
    }
}