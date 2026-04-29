export class InvalidUpdateTransactionTitleError extends Error {
	constructor() {
		super("Transaction title is required.");
		this.name = "InvalidUpdateTransactionTitleError";
	}
}
