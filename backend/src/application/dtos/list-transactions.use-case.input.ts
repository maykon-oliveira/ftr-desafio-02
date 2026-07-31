import type { TransactionType } from "~/domain/transaction.model";

export interface ListTransactionsUseCaseInput {
	userId: string;
	description?: string;
	type?: TransactionType;
	categoryId?: string;
	month?: number;
	year?: number;
}
