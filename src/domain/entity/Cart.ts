import * as _ from "lodash";
import { Product } from "./Product";

export class Cart {
    private products: Product[];

    constructor() {
        this.products = [];
    }

    public getProducts() {
        return this.products;
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
}
