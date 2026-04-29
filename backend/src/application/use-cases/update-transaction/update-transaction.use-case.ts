import { Service } from "typedi";
import type { UpdateTransactionUseCaseInput } from "~/application/dtos/update-transaction.use-case.input";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import type { UpdateTransactionUseCaseOutput } from "~/application/dtos/update-transaction.use-case.output";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";
import { InvalidUpdateTransactionAmountError } from "./errors/invalid-update-transaction-amount.error";
import { InvalidUpdateTransactionCategoryError } from "./errors/invalid-update-transaction-category.error";
import { InvalidUpdateTransactionTitleError } from "./errors/invalid-update-transaction-title.error";
import { TransactionNotFoundError } from "./errors/transaction-not-found.error";

@Service()
export class UpdateTransactionUseCase {
	constructor(
		private readonly transactionRepository: PrismaTransactionRepository,
		private readonly categoryRepository: PrismaCategoryRepository,
	) {}

	async execute(
		input: UpdateTransactionUseCaseInput,
	): Promise<UpdateTransactionUseCaseOutput> {
		const normalizedTitle = input.title?.trim();
		const normalizedDescription = input.description?.trim();
		const normalizedCategoryId = input.categoryId?.trim();

		if (input.title !== undefined && !normalizedTitle) {
			throw new InvalidUpdateTransactionTitleError();
		}

		if (input.amount !== undefined && input.amount <= 0) {
			throw new InvalidUpdateTransactionAmountError();
		}

		if (input.categoryId !== undefined && !normalizedCategoryId) {
			throw new InvalidUpdateTransactionCategoryError();
		}

		if (normalizedCategoryId) {
			const category = await this.categoryRepository.findByIdAndUserId(
				normalizedCategoryId,
				input.userId,
			);

			if (!category) {
				throw new InvalidUpdateTransactionCategoryError();
			}
		}

		const transaction = await this.transactionRepository.updateByIdAndUserId({
			...input,
			title: normalizedTitle,
			description:
				input.description !== undefined
					? normalizedDescription || undefined
					: undefined,
			categoryId:
				input.categoryId !== undefined
					? normalizedCategoryId || undefined
					: undefined,
		});

		if (!transaction) {
			throw new TransactionNotFoundError();
		}

		return {
			transaction,
		};
	}
}
