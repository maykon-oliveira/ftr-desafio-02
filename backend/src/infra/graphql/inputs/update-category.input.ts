import { Field, InputType } from "type-graphql";
import type { UpdateCategoryUseCaseInput } from "~/application/dtos/update-category.use-case.input";

@InputType()
export class UpdateCategoryInput
	implements Omit<UpdateCategoryUseCaseInput, "id" | "userId">
{
	@Field(() => String, { nullable: true })
	name?: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String, { nullable: true })
	icon?: string;

	@Field(() => String, { nullable: true })
	color?: string;
}
