import { Service } from "typedi";
import type { UpdateTransactionUseCaseInput } from "~/application/dtos/update-transaction.use-case.input";
import type { UpdateTransactionUseCaseOutput } from "~/application/dtos/update-transaction.use-case.output";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";
import { InvalidUpdateTransactionAmountError } from "./errors/invalid-update-transaction-amount.error";
import { InvalidUpdateTransactionTitleError } from "./errors/invalid-update-transaction-title.error";
import { TransactionNotFoundError } from "./errors/transaction-not-found.error";

@Service()
export class UpdateTransactionUseCase {
	constructor(
		private readonly transactionRepository: PrismaTransactionRepository,
	) {}

	async execute(
		input: UpdateTransactionUseCaseInput,
	): Promise<UpdateTransactionUseCaseOutput> {
		const normalizedTitle = input.title?.trim();
		const normalizedDescription = input.description?.trim();

		if (input.title !== undefined && !normalizedTitle) {
			throw new InvalidUpdateTransactionTitleError();
		}

		if (input.amount !== undefined && input.amount <= 0) {
			throw new InvalidUpdateTransactionAmountError();
		}

		const transaction = await this.transactionRepository.updateByIdAndUserId({
			...input,
			title: normalizedTitle,
			description:
				input.description !== undefined
					? normalizedDescription || undefined
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
