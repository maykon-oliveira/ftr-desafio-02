import type { TransactionModel } from "~/domain/transaction.model";

export interface UpdateTransactionUseCaseOutput {
	transaction: TransactionModel;
}
