import type { TransactionType } from "~/domain/transaction.model";

export interface UpdateTransactionUseCaseInput {
	id: string;
	userId: string;
	description?: string;
	amount?: number;
	type?: TransactionType;
	occurredAt?: Date;
	categoryId?: string;
}
