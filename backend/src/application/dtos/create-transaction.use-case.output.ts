import type { TransactionModel } from "~/domain/transaction.model";

export interface CreateTransactionUseCaseOutput {
	transaction: TransactionModel;
};
