import { Field, ObjectType } from "type-graphql";
import type { CreateCategoryUseCaseOutput } from "~/application/dtos/create-category.use-case.output";
import { CategoryModel } from "~/domain/category.model";

@ObjectType()
export class CreateCategoryOutput implements CreateCategoryUseCaseOutput {
	@Field(() => CategoryModel)
	category!: CategoryModel;
}
