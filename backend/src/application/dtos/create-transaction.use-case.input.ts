import type { TransactionType } from "~/domain/transaction.model";

export interface CreateTransactionUseCaseInput {
	description: string;
	amount: number;
	type: TransactionType;
	occurredAt: Date;
	categoryId: string;
	userId: string;
}
