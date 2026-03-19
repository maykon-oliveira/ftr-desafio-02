import { Field, ObjectType } from "type-graphql";
import type { RegisterUserUseCaseOutput } from "~/application/dtos/register-user.use-case.output";
import { UserModel } from "~/domain/user.model";

@ObjectType()
export class RegisterUserOutput implements RegisterUserUseCaseOutput {
	@Field(() => String)
	token!: string;

	@Field(() => String)
	refreshToken!: string;

	@Field(() => UserModel)
	user!: UserModel;
}
