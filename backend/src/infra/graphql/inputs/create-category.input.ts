import { Field, InputType } from "type-graphql";
import type { CreateCategoryUseCaseInput } from "~/application/dtos/create-category.use-case.input";

@InputType()
export class CreateCategoryInput
	implements Omit<CreateCategoryUseCaseInput, "userId">
{
	@Field(() => String)
	name!: string;
}
