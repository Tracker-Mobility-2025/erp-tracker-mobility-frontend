


export class ApplicantCompany {
    constructor(
        {
            applicantCompanyId = null,
            companyName = null,
            contactPhoneNumber = null,
            corporateEmail = null,
            executiveName = null,
            ruc = null,
        } = {}
    ) {
        this.applicantCompanyId = applicantCompanyId;
        this.companyName = companyName;
        this.executiveName = executiveName;
        this.ruc = ruc;
        this.corporateEmail = corporateEmail;
        this.contactPhoneNumber = contactPhoneNumber;
    }
}