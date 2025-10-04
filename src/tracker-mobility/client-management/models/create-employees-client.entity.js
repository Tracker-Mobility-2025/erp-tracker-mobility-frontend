
export class CreateEmployeeClient {

    constructor(
        {
            email = "",
            password = "",
            name = "",
            lastName = "",
            phoneNumber= null,
            applicantCompanyId = null
        }
    )
    {
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.applicantCompanyId = applicantCompanyId;
    }
}