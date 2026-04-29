export class InvalidUpdateCategoryNameError extends Error {
	constructor() {
		super("Category name is required.");
		this.name = "InvalidUpdateCategoryNameError";
	}
}
