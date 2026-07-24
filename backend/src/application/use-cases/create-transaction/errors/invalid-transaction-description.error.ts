export class InvalidTransactionDescriptionError extends Error {
	constructor() {
		super("Transaction description is required.");
		this.name = "InvalidTransactionDescriptionError";
	}
}
