import { Service } from "typedi";
import type { UpdateCategoryUseCaseInput } from "~/application/dtos/update-category.use-case.input";
import type { UpdateCategoryUseCaseOutput } from "~/application/dtos/update-category.use-case.output";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import { CategoryNameAlreadyInUseError } from "./errors/category-name-already-in-use.error";
import { CategoryNotFoundError } from "./errors/category-not-found.error";
import { InvalidUpdateCategoryNameError } from "./errors/invalid-update-category-name.error";

@Service()
export class UpdateCategoryUseCase {
	constructor(private readonly categoryRepository: PrismaCategoryRepository) {}

	async execute(
		input: UpdateCategoryUseCaseInput,
	): Promise<UpdateCategoryUseCaseOutput> {
		const normalizedName = input.name?.trim();

		if (input.name !== undefined && !normalizedName) {
			throw new InvalidUpdateCategoryNameError();
		}

		if (normalizedName) {
			const existing = await this.categoryRepository.findByNameAndUserId(
				normalizedName,
				input.userId,
			);

			if (existing && existing.id !== input.id) {
				throw new CategoryNameAlreadyInUseError();
			}
		}

		const category = await this.categoryRepository.updateByIdAndUserId({
			...input,
			name: normalizedName,
		});

		if (!category) {
			throw new CategoryNotFoundError();
		}

		return { category };
	}
}
