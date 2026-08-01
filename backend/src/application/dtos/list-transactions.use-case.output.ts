import type { TransactionModel } from "~/domain/transaction.model";

export interface ListTransactionsUseCaseOutput {
	transactions: TransactionModel[];
	totalCount: number;
}
