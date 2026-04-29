import { Service } from "typedi";
import type { ListCategoriesUseCaseInput } from "~/application/dtos/list-categories.use-case.input";
import type { ListCategoriesUseCaseOutput } from "~/application/dtos/list-categories.use-case.output";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";

@Service()
export class ListCategoriesUseCase {
	constructor(private readonly categoryRepository: PrismaCategoryRepository) {}

	async execute(
		input: ListCategoriesUseCaseInput,
	): Promise<ListCategoriesUseCaseOutput> {
		const categories = await this.categoryRepository.findManyByUserId(
			input.userId,
		);

		return { categories };
	}
}
