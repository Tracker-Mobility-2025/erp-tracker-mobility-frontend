

export class EmployeeClientTracker {

    constructor(
        {
            id = null,
            companyId = null,
            role = null,
            name = '',
            lastName = '',
            email = '',
            phone = '',
            status = null,
        }
    ) {
        this.id = id;
        this.companyId = companyId
        this.role = role;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.status = status;
    }



}