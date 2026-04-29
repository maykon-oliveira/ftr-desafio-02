import { Field, ObjectType } from "type-graphql";
import type { ListCategoriesUseCaseOutput } from "~/application/dtos/list-categories.use-case.output";
import { CategoryModel } from "~/domain/category.model";

@ObjectType()
export class ListCategoriesOutput implements ListCategoriesUseCaseOutput {
	@Field(() => [CategoryModel])
	categories!: CategoryModel[];
}
