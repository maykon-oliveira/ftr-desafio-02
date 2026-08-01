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
		const filterParams = {
			description: input.description,
			type: input.type,
			categoryId: input.categoryId,
			month: input.month,
			year: input.year,
		};

		const [transactions, totalCount] = await Promise.all([
			this.transactionRepository.findManyByUserId(input.userId, {
				...filterParams,
				page: input.page,
				pageSize: input.pageSize,
			}),
			this.transactionRepository.countByUserId(input.userId, filterParams),
		]);

		return {
			transactions,
			totalCount,
		};
	}
}
