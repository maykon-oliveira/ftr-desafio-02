import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { UserModel } from "~/domain/user.model";
import { GetUserByIdUseCase } from "~/application/use-cases/get-user-by-id/get-user-by-id.use-case";
import { UpdateUserUseCase } from "~/application/use-cases/update-user/update-user.use-case";
import type { UpdateUserUseCaseInput } from "~/application/dtos/update-user.use-case.input";
import { isAuth } from "../middleware/auth.middleware";
import type { GraphqlContext } from "../context";

@ObjectType()
class UpdateUserOutput {
	@Field(() => UserModel)
	user!: UserModel;
}

@InputType()
class UpdateUserInput {
	@Field(() => String)
	name!: string;
}

@Service()
@Resolver(() => UserModel)
export class UserResolver {
	constructor(
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
	) {}

	@Query(() => UserModel)
	@UseMiddleware(isAuth)
	async getUser(@Arg("id", () => String) id: string): Promise<UserModel> {
		return this.getUserByIdUseCase.execute(id);
	}

	@Mutation(() => UpdateUserOutput)
	@UseMiddleware(isAuth)
	async updateUser(
		@Arg("data", () => UpdateUserInput) data: UpdateUserInput,
		@Ctx() context: GraphqlContext,
	): Promise<UpdateUserOutput> {
		const input: UpdateUserUseCaseInput = {
			id: context.user!,
			...data,
		};

		return this.updateUserUseCase.execute(input);
	}
}
