export class CategoryNameAlreadyInUseError extends Error {
	constructor() {
		super("Category name already in use.");
		this.name = "CategoryNameAlreadyInUseError";
	}
}
