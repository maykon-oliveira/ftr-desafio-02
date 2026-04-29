import { Service } from "typedi";
import type { DeleteTransactionUseCaseInput } from "~/application/dtos/delete-transaction.use-case.input";
import type { DeleteTransactionUseCaseOutput } from "~/application/dtos/delete-transaction.use-case.output";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";
import { TransactionNotFoundError } from "./errors/transaction-not-found.error";

@Service()
export class DeleteTransactionUseCase {
	constructor(
		private readonly transactionRepository: PrismaTransactionRepository,
	) {}

	async execute(
		input: DeleteTransactionUseCaseInput,
	): Promise<DeleteTransactionUseCaseOutput> {
		const wasDeleted = await this.transactionRepository.deleteByIdAndUserId(
			input.id,
			input.userId,
		);

		if (!wasDeleted) {
			throw new TransactionNotFoundError();
		}

		return {
			success: true,
		};
	}
}
