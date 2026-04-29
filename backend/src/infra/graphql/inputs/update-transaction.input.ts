import { Field, Float, GraphQLISODateTime, InputType } from "type-graphql";
import type { UpdateTransactionUseCaseInput } from "~/application/dtos/update-transaction.use-case.input";
import { TransactionType } from "~/domain/transaction.model";

@InputType()
export class UpdateTransactionInput
	implements Omit<UpdateTransactionUseCaseInput, "id" | "userId">
{
	@Field(() => String, { nullable: true })
	title?: string;

	@Field(() => Float, { nullable: true })
	amount?: number;

	@Field(() => TransactionType, { nullable: true })
	type?: TransactionType;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => GraphQLISODateTime, { nullable: true })
	occurredAt?: Date;
}
