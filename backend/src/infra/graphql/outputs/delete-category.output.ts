import { Field, ObjectType } from "type-graphql";
import type { DeleteCategoryUseCaseOutput } from "~/application/dtos/delete-category.use-case.output";

@ObjectType()
export class DeleteCategoryOutput implements DeleteCategoryUseCaseOutput {
	@Field(() => Boolean)
	success!: boolean;
}
