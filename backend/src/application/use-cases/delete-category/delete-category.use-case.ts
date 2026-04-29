import { Service } from "typedi";
import type { DeleteCategoryUseCaseInput } from "~/application/dtos/delete-category.use-case.input";
import type { DeleteCategoryUseCaseOutput } from "~/application/dtos/delete-category.use-case.output";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import { CategoryNotFoundError } from "./errors/category-not-found.error";

@Service()
export class DeleteCategoryUseCase {
	constructor(private readonly categoryRepository: PrismaCategoryRepository) {}

	async execute(
		input: DeleteCategoryUseCaseInput,
	): Promise<DeleteCategoryUseCaseOutput> {
		const wasDeleted = await this.categoryRepository.deleteByIdAndUserId(
			input.id,
			input.userId,
		);

		if (!wasDeleted) {
			throw new CategoryNotFoundError();
		}

		return {
			success: true,
		};
	}
}
