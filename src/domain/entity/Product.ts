import { File } from "./File";

export class Product {
    private uuid: string;
    private name: string;
    private price: number; // TODO: https://martinfowler.com/eaaCatalog/money.html
    private description: string;
    private filesAvailableAfterPurchase: File[];
    private demoFiles: File[];

    constructor(uuid: string, name: string, price: number) {
        this.uuid = uuid;
        this.name = name;
        this.price = price;
        this.filesAvailableAfterPurchase = [];
        this.demoFiles = [];
    }

    public getUuid() {
        return this.uuid;
    }

    public getPrice() {
        return this.price;
    }

    public getFilesAvailableAfterPurchase() {
        return this.filesAvailableAfterPurchase;
    }

    public getDemoFiles() {
        return this.demoFiles;
    }
}
