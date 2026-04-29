import type { CategoryModel } from "~/domain/category.model";

export interface ListCategoriesUseCaseOutput {
	categories: CategoryModel[];
}
