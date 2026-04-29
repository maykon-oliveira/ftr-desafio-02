export class InvalidTransactionCategoryError extends Error {
	constructor() {
		super("Category not found.");
		this.name = "InvalidTransactionCategoryError";
	}
}
