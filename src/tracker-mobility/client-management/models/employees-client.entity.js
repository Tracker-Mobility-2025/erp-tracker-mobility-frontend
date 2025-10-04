
export class EmployeeClientTracker {

    constructor(
        {
            id = null,
            email = "",
            name = "",
            lastName = "",
            phoneNumber = null,
            applicantCompanyId = null,
            status = "ACTIVE"
        }
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.applicantCompanyId = applicantCompanyId;
        this.status = status;
    }



}