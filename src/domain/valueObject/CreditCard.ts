export class CreditCard {
    private creditCardNumber: string;
    private expirationMonth: number;
    private expirationYear: number;
    private cvv: number;
    private owner: string;

    constructor(
        creditCardNumber: string,
        expirationMonth: number,
        expirationYear: number,
        cvv: number,
        owner: string,
    ) {
        this.creditCardNumber = creditCardNumber;
        this.expirationMonth = expirationMonth;
        this.expirationYear = expirationYear;
        this.cvv = cvv;
        this.owner = owner;
    }
}
