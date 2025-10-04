
export class EmployeeClientTracker {

    constructor(
        {
            id = null,
            email = "",
            name = "",
            lastName = "",
            phone = "",
            companyId = null,
            status = "ACTIVE"
        }
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.lastName = lastName;
        this.phone = phone;
        this.companyId = companyId;
        this.status = status;
    }



}