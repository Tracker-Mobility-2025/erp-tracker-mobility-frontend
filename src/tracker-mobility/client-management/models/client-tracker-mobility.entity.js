
export class ClientTracker {

    constructor(
        {
            id = null,
            ruc = "",
            companyName = "",
            status = "",
        } = {}
    ) {
        this.id = id;
        this.ruc = ruc;
        this.companyName = companyName;
        this.status = status;
    }

}