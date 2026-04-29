import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { CreateCategoryUseCase } from "~/application/use-cases/create-category/create-category.use-case";
import type { GraphqlContext } from "../context";
import { isAuth } from "../middleware/auth.middleware";
import { CreateCategoryInput } from "../inputs/create-category.input";
import { CreateCategoryOutput } from "../outputs/create-category.output";

@Service()
@Resolver()
export class CategoryResolver {
	constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

	@Mutation(() => CreateCategoryOutput)
	@UseMiddleware(isAuth)
	async createCategory(
		@Arg("data", () => CreateCategoryInput) input: CreateCategoryInput,
		@Ctx() context: GraphqlContext,
	): Promise<CreateCategoryOutput> {
		return this.createCategoryUseCase.execute({
			...input,
			userId: context.user!,
		});
	}
}
