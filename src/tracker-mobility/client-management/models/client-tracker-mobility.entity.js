

export class ClientTracker {

    constructor(
        {
            id = null,
            RUC = null,
            companyName = null,
            role = null,
        }
    )
    {
        this.id = id;
        this.RUC = RUC;
        this.companyName = companyName;
        this.role = role;
    }


}