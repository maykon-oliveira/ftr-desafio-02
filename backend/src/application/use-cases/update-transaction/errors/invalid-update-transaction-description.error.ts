export class InvalidUpdateTransactionDescriptionError extends Error {
	constructor() {
		super("Transaction description is required.");
		this.name = "InvalidUpdateTransactionDescriptionError";
	}
}
