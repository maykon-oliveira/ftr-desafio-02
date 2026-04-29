import { Field, ObjectType } from "type-graphql";
import type { UpdateCategoryUseCaseOutput } from "~/application/dtos/update-category.use-case.output";
import { CategoryModel } from "~/domain/category.model";

@ObjectType()
export class UpdateCategoryOutput implements UpdateCategoryUseCaseOutput {
	@Field(() => CategoryModel)
	category!: CategoryModel;
}
