import { Field, InputType, Int } from "type-graphql";
import { TransactionType } from "~/domain/transaction.model";

@InputType()
export class ListTransactionsFilter {
	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => TransactionType, { nullable: true })
	type?: TransactionType;

	@Field(() => String, { nullable: true })
	categoryId?: string;

	@Field(() => Int, { nullable: true })
	month?: number;

	@Field(() => Int, { nullable: true })
	year?: number;
}
