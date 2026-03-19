import { Field, InputType } from "type-graphql";
import type { LoginUserUseCaseInput } from "~/application/dtos/login-user.use-case.input";

@InputType()
export class LoginUserInput implements LoginUserUseCaseInput {
	@Field(() => String)
	email!: string;

	@Field(() => String)
	password!: string;
}