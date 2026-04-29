import { Service } from "typedi";
import type { CreateCategoryUseCaseInput } from "~/application/dtos/create-category.use-case.input";
import type { CreateCategoryUseCaseOutput } from "~/application/dtos/create-category.use-case.output";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import { CategoryNameAlreadyExistsError } from "./errors/category-name-already-exists.error";
import { InvalidCategoryNameError } from "./errors/invalid-category-name.error";

@Service()
export class CreateCategoryUseCase {
	constructor(private readonly categoryRepository: PrismaCategoryRepository) {}

	async execute(
		input: CreateCategoryUseCaseInput,
	): Promise<CreateCategoryUseCaseOutput> {
		const normalizedName = input.name.trim();

		if (!normalizedName) {
			throw new InvalidCategoryNameError();
		}

		const existing = await this.categoryRepository.findByNameAndUserId(
			normalizedName,
			input.userId,
		);

		if (existing) {
			throw new CategoryNameAlreadyExistsError();
		}

		const category = await this.categoryRepository.create({
			...input,
			name: normalizedName,
		});

		return { category };
	}
}
