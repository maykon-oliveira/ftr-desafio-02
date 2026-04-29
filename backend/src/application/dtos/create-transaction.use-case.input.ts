import type { TransactionType } from "~/domain/transaction.model";

export interface CreateTransactionUseCaseInput {
	title: string;
	amount: number;
	type: TransactionType;
	description?: string;
	occurredAt?: Date;
	userId: string;
}
