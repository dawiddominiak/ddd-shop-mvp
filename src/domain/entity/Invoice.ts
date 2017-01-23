export class Invoice {
    private uuid: string;
    private externalId: string;

    constructor(uuid: string, externalId: string) {
        this.uuid = uuid;
        this.externalId = externalId;
    }
}
