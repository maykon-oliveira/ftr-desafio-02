import { Field, Float, GraphQLISODateTime, InputType } from "type-graphql";
import type { CreateTransactionUseCaseInput } from "~/application/dtos/create-transaction.use-case.input";
import { TransactionType } from "~/domain/transaction.model";

@InputType()
export class CreateTransactionInput
	implements Omit<CreateTransactionUseCaseInput, "userId">
{
	@Field(() => String)
	title!: string;

	@Field(() => Float)
	amount!: number;

	@Field(() => TransactionType)
	type!: TransactionType;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => GraphQLISODateTime, { nullable: true })
	occurredAt?: Date;
}
