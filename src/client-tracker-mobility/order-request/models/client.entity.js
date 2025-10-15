

export class Client {
    constructor(
        {
            lastName = "",
            documentNumber = "",
            landlordName = "",
            name = "",
            district = "",
            province = "",
            mapLocation = "",
            department = "",
            isTenant = false,
            homeAddress = "",
            documentType = "",
            phoneNumber = "",
            landlordPhoneNumber = "",
            documents = []
        } = {}
    ) {
        this.lastName = lastName;
        this.documentNumber = documentNumber;
        this.landlordName = landlordName;
        this.name = name;
        this.district = district;
        this.province = province;
        this.mapLocation = mapLocation;
        this.department = department;
        this.isTenant = isTenant;
        this.homeAddress = homeAddress;
        this.documentType = documentType;
        this.phoneNumber = phoneNumber;
        this.landlordPhoneNumber = landlordPhoneNumber;
        this.documents = documents;
    }
}
