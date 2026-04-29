import { Field, ObjectType } from "type-graphql";
import type { CreateTransactionUseCaseOutput } from "~/application/dtos/create-transaction.use-case.output";
import { TransactionModel } from "~/domain/transaction.model";

@ObjectType()
export class CreateTransactionOutput implements CreateTransactionUseCaseOutput {
	@Field(() => TransactionModel)
	transaction!: TransactionModel;
}
