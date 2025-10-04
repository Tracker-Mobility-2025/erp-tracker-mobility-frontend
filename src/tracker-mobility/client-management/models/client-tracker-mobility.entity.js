

export class ClientTracker {

    constructor(
        {
            id = null,
            companyName = "",
            executiveName = "",
            ruc = "",
            corporateEmail = "",
            contactPhoneNumber = ""
        } = {}
    ) {
        this.id = id;
        this.companyName = companyName;
        this.executiveName = executiveName;
        this.ruc = ruc;
        this.corporateEmail = corporateEmail;
        this.contactPhoneNumber = contactPhoneNumber;
    }

}