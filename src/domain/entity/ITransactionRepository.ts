import * as Promise from "bluebird";
import { Transaction } from "./Transaction";

export interface ITransactionRepository {
    save(transaction: Transaction): Promise<any>;
    getNextId(): string;
}
