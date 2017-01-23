import * as Promise from "bluebird";
import { injectable } from "inversify";
import { Transaction } from "../../domain/entity/Transaction";
import { IAfterTransactionTask } from "../../domain/service/IAfterTransactionTask";

@injectable()
export class InvoiceManager implements IAfterTransactionTask {
    public process(transaction: Transaction): Promise<any> {
        // TODO: connect to invoice serivce
        // TODO: send email with invoice then
        // TODO: persist invoice somehow
        console.log("INVOICE CREATED");

        return Promise.resolve();
    }
}
