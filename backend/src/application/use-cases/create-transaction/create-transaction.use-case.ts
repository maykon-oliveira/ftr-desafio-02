import { Service } from "typedi";
import type { CreateTransactionUseCaseInput } from "~/application/dtos/create-transaction.use-case.input";
import type { CreateTransactionUseCaseOutput } from "~/application/dtos/create-transaction.use-case.output";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";
import { InvalidTransactionAmountError } from "./errors/invalid-transaction-amount.error";
import { InvalidTransactionCategoryError } from "./errors/invalid-transaction-category.error";
import { InvalidTransactionDescriptionError } from "./errors/invalid-transaction-description.error";

@Service()
export class CreateTransactionUseCase {
	constructor(
		private readonly transactionRepository: PrismaTransactionRepository,
		private readonly categoryRepository: PrismaCategoryRepository,
	) { }

	async execute(
		input: CreateTransactionUseCaseInput,
	): Promise<CreateTransactionUseCaseOutput> {
		const normalizedDescription = input.description.trim();
		const normalizedCategoryId = input.categoryId?.trim();

		if (!normalizedDescription) {
			throw new InvalidTransactionDescriptionError();
		}

		if (input.amount <= 0) {
			throw new InvalidTransactionAmountError();
		}

		if (input.categoryId !== undefined && !normalizedCategoryId) {
			throw new InvalidTransactionCategoryError();
		}

		if (normalizedCategoryId) {
			const category = await this.categoryRepository.findByIdAndUserId(
				normalizedCategoryId,
				input.userId,
			);

			if (!category) {
				throw new InvalidTransactionCategoryError();
			}
		}

		const transaction = await this.transactionRepository.create({
			...input,
			description: normalizedDescription,
			categoryId: normalizedCategoryId || undefined,
		});

		return {
			transaction,
		};
	}
}
