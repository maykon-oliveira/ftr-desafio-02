import { Service } from "typedi";
import type { GetDashboardUseCaseInput } from "~/application/dtos/get-dashboard.use-case.input";
import type { GetDashboardUseCaseOutput } from "~/application/dtos/get-dashboard.use-case.output";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import type { CategoryTotalModel } from "~/domain/dashboard.model";

@Service()
export class GetDashboardUseCase {
	constructor(
		private readonly transactionRepository: PrismaTransactionRepository,
		private readonly categoryRepository: PrismaCategoryRepository,
	) { }

	async execute(
		input: GetDashboardUseCaseInput,
	): Promise<GetDashboardUseCaseOutput> {
		const now = new Date();
		const month = input.month ?? now.getMonth() + 1;
		const year = input.year ?? now.getFullYear();

		const [
			totalBalance,
			monthlyIncome,
			monthlyExpense,
			lastTransactions,
			categoryAggregates,
		] = await Promise.all([
			this.transactionRepository.aggregateBalance(input.userId),
			this.transactionRepository.aggregateByType(input.userId, "INCOME", month, year),
			this.transactionRepository.aggregateByType(input.userId, "EXPENSE", month, year),
			this.transactionRepository.findLastByUserId(input.userId, 5),
			this.transactionRepository.aggregateByCategory(input.userId),
		]);

		// Resolve category details for each aggregate
		const allCategories = await this.categoryRepository.findManyByUserId(input.userId);
		const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

		const categoryTotals: CategoryTotalModel[] = categoryAggregates
			.filter((agg) => categoryMap.has(agg.categoryId))
			.map((agg) => {
				const cat = categoryMap.get(agg.categoryId)!;
				return {
					categoryId: cat.id,
					categoryName: cat.name,
					icon: cat.icon,
					color: cat.color,
					total: agg.total,
					transactionsCount: cat.transactionsCount
				} as CategoryTotalModel;
			})
			.sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

		return {
			totalBalance,
			monthlyIncome,
			monthlyExpense,
			lastTransactions,
			categoryTotals,
		};
	}
}
