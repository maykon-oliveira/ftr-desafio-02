import { Service } from "typedi";
import type { ListTransactionsUseCaseInput } from "~/application/dtos/list-transactions.use-case.input";
import type { ListTransactionsUseCaseOutput } from "~/application/dtos/list-transactions.use-case.output";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";

@Service()
export class ListTransactionsUseCase {
	constructor(
		private readonly transactionRepository: PrismaTransactionRepository,
	) {}

	async execute(
		input: ListTransactionsUseCaseInput,
	): Promise<ListTransactionsUseCaseOutput> {
		const transactions = await this.transactionRepository.findManyByUserId(
			input.userId,
			{
				description: input.description,
				type: input.type,
				categoryId: input.categoryId,
				month: input.month,
				year: input.year,
			},
		);

		return {
			transactions,
		};
	}
}
