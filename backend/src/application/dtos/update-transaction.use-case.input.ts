import type { TransactionType } from "~/domain/transaction.model";

export interface UpdateTransactionUseCaseInput {
	id: string;
	userId: string;
	title?: string;
	amount?: number;
	type?: TransactionType;
	description?: string;
	occurredAt?: Date;
}
