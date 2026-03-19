import { Field, InputType } from "type-graphql";
import type { RegisterUserUseCaseInput } from "~/application/dtos/register-user.use-case.input";

@InputType()
export class RegisterUserInput implements RegisterUserUseCaseInput {
	@Field(() => String)
	name!: string;

	@Field(() => String)
	email!: string;

	@Field(() => String)
	password!: string;
}
