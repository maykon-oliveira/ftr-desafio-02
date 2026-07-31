import type { CategoryTotalModel } from "~/domain/dashboard.model";
import type { TransactionModel } from "~/domain/transaction.model";

export interface GetDashboardUseCaseOutput {
	totalBalance: number;
	monthlyIncome: number;
	monthlyExpense: number;
	lastTransactions: TransactionModel[];
	categoryTotals: CategoryTotalModel[];
}
