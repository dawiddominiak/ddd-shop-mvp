import * as _ from "lodash";
import { Product } from "./Product";
import { Transaction } from "./Transaction";
import { User } from "./User";

export class Cart {
    private uuid: string;
    private products: Product[];
    private user: User;
    private transaction?: Transaction;

    constructor(uuid: string, user: User) {
        this.products = [];
        this.uuid = uuid;
        this.user = user;
    }

    public getProducts() {
        return this.products;
    }

    public getUser() {
        return this.getUser;
    }

    public getTotalPrice(): number {
        return this.products.reduce((total, product) => {
            return total + product.getPrice();
        }, 0);
    }

    public addProduct(product: Product) {
        this.products.push(product);
    }

    public removeProduct(productToBeRemoved: Product) {
        _.pull(this.products, productToBeRemoved);
    }

    public bindTransaction(transaction: Transaction) {
        this.transaction = transaction;
    }
}
