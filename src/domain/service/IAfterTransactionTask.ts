import { Transaction } from "../entity/Transaction";

export interface IAfterTransactionTask {
    process(transaction: Transaction);
}
