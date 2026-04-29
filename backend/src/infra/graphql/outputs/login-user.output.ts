import { Field, ObjectType } from "type-graphql";
import type { LoginUserUseCaseOutput } from "~/application/dtos/login-user.use-case.output";
import { UserModel } from "~/domain/user.model";

@ObjectType()
export class LoginUserOutput implements LoginUserUseCaseOutput {
	@Field(() => String)
	token!: string;

	@Field(() => String)
	refreshToken!: string;

	@Field(() => UserModel)
	user!: UserModel;
}
