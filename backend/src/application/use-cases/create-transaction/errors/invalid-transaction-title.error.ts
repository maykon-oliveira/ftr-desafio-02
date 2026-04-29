export class InvalidTransactionTitleError extends Error {
	constructor() {
		super("Transaction title is required.");
		this.name = "InvalidTransactionTitleError";
	}
}
