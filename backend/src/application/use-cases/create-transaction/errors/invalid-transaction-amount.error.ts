export class InvalidTransactionAmountError extends Error {
	constructor() {
		super("Transaction amount must be greater than zero.");
		this.name = "InvalidTransactionAmountError";
	}
}
