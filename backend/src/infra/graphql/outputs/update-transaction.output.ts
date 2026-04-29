import { Field, ObjectType } from "type-graphql";
import type { UpdateTransactionUseCaseOutput } from "~/application/dtos/update-transaction.use-case.output";
import { TransactionModel } from "~/domain/transaction.model";

@ObjectType()
export class UpdateTransactionOutput implements UpdateTransactionUseCaseOutput {
	@Field(() => TransactionModel)
	transaction!: TransactionModel;
}
