import { Field, InputType } from "type-graphql";
import type { CreateCategoryUseCaseInput } from "~/application/dtos/create-category.use-case.input";

@InputType()
export class CreateCategoryInput
	implements Omit<CreateCategoryUseCaseInput, "userId"> {
	@Field(() => String)
	name!: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String)
	icon!: string;

	@Field(() => String)
	color!: string;
}
