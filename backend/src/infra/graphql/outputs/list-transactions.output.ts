import { Field, Int, ObjectType } from "type-graphql";
import type { ListTransactionsUseCaseOutput } from "~/application/dtos/list-transactions.use-case.output";
import { TransactionModel } from "~/domain/transaction.model";

@ObjectType()
export class ListTransactionsOutput implements ListTransactionsUseCaseOutput {
	@Field(() => [TransactionModel])
	transactions!: TransactionModel[];

	@Field(() => Int)
	totalCount!: number;
}
