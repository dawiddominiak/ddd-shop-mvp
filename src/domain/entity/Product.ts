import { File } from "../valueObject/File";

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

    public getName() {
        return this.name;
    }

    public getFilesAvailableAfterPurchase() {
        return this.filesAvailableAfterPurchase;
    }

    public addFileAvailableAfterPurchase(file: File) {
        this.filesAvailableAfterPurchase.push(file);
    }

    public getDemoFiles() {
        return this.demoFiles;
    }

    public isOnList(products: Product[]) {
        for (const product of products) {
            if (product.sameIdentityAs(this)) {
                return true;
            }
        }

        return false;
    }

    public addDemoFile(file: File) {
        this.demoFiles.push(file);
    }

    public sameIdentityAs(other: Product) {
        return this.uuid === other.uuid;
    }
}
