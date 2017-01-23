import * as Promise from "bluebird";
import { Invoice } from "./Invoice";

export interface IInvoiceRepository {
    add(invoice: Invoice);
    get(uuid: string): Promise<Invoice>;
}
