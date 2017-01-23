import * as Promise from "bluebird";
import { Transaction } from "../entity/Transaction";

export interface IAfterTransactionTask {
    process(transaction: Transaction): Promise<any>;
}
