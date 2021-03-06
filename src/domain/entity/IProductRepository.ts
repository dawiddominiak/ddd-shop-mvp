import * as Promise from "bluebird";
import { Product } from "./Product";
import { User } from "./User";

export interface IProductRepository {
    add(product: Product);
    list(): Promise<Product[]>;
    getById(uuid: string): Promise<Product>;
    listOwnedBy(user: User): Promise<Product[]>;
    getNextId(): string;
}
