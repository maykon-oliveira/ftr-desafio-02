import { Arg, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { LoginUserUseCase } from "~/application/use-cases/login-user/login-user.use-case";
import { RegisterUserInput } from "../inputs/register-user.input";
import { LoginUserInput } from "../inputs/login-user.input";
import { RegisterUserOutput } from "../outputs/register-user.output";
import { LoginUserOutput } from "../outputs/login-user.output";
import { RegisterUserUseCase } from "~/application/use-cases/register-user/register-user.use-case";

@Service()
@Resolver()
export class AuthResolver {
	constructor(
		private readonly registerUserUseCase: RegisterUserUseCase,
		private readonly loginUserUseCase: LoginUserUseCase,
	) {}

	@Mutation(() => RegisterUserOutput)
	async registerUser(
		@Arg("data", () => RegisterUserInput) input: RegisterUserInput,
	): Promise<RegisterUserOutput> {
		return this.registerUserUseCase.execute(input);
	}

	@Mutation(() => LoginUserOutput)
	async login(
		@Arg("data", () => LoginUserInput) input: LoginUserInput,
	): Promise<LoginUserOutput> {
		return this.loginUserUseCase.execute(input);
	}
}
