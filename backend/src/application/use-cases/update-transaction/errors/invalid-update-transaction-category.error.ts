export class InvalidUpdateTransactionCategoryError extends Error {
	constructor() {
		super("Category not found.");
		this.name = "InvalidUpdateTransactionCategoryError";
	}
}
