export class InvalidCategoryNameError extends Error {
	constructor() {
		super("Category name is required.");
		this.name = "InvalidCategoryNameError";
	}
}
