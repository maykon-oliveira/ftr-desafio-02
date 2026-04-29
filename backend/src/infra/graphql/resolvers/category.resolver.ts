import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { Service } from "typedi";
import { CreateCategoryUseCase } from "~/application/use-cases/create-category/create-category.use-case";
import { DeleteCategoryUseCase } from "~/application/use-cases/delete-category/delete-category.use-case";
import { ListCategoriesUseCase } from "~/application/use-cases/list-categories/list-categories.use-case";
import { UpdateCategoryUseCase } from "~/application/use-cases/update-category/update-category.use-case";
import type { GraphqlContext } from "../context";
import { isAuth } from "../middleware/auth.middleware";
import { CreateCategoryInput } from "../inputs/create-category.input";
import { UpdateCategoryInput } from "../inputs/update-category.input";
import { CreateCategoryOutput } from "../outputs/create-category.output";
import { DeleteCategoryOutput } from "../outputs/delete-category.output";
import { ListCategoriesOutput } from "../outputs/list-categories.output";
import { UpdateCategoryOutput } from "../outputs/update-category.output";

@Service()
@Resolver()
export class CategoryResolver {
	constructor(
		private readonly createCategoryUseCase: CreateCategoryUseCase,
		private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
		private readonly listCategoriesUseCase: ListCategoriesUseCase,
		private readonly updateCategoryUseCase: UpdateCategoryUseCase,
	) {}

	@Query(() => ListCategoriesOutput)
	@UseMiddleware(isAuth)
	async listCategories(
		@Ctx() context: GraphqlContext,
	): Promise<ListCategoriesOutput> {
		return this.listCategoriesUseCase.execute({ userId: context.user! });
	}

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

	@Mutation(() => UpdateCategoryOutput)
	@UseMiddleware(isAuth)
	async updateCategory(
		@Arg("id", () => String) id: string,
		@Arg("data", () => UpdateCategoryInput) input: UpdateCategoryInput,
		@Ctx() context: GraphqlContext,
	): Promise<UpdateCategoryOutput> {
		return this.updateCategoryUseCase.execute({
			...input,
			id,
			userId: context.user!,
		});
	}

	@Mutation(() => DeleteCategoryOutput)
	@UseMiddleware(isAuth)
	async deleteCategory(
		@Arg("id", () => String) id: string,
		@Ctx() context: GraphqlContext,
	): Promise<DeleteCategoryOutput> {
		return this.deleteCategoryUseCase.execute({
			id,
			userId: context.user!,
		});
	}
}
