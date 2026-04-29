import { Field, ObjectType } from "type-graphql";
import type { DeleteTransactionUseCaseOutput } from "~/application/dtos/delete-transaction.use-case.output";

@ObjectType()
export class DeleteTransactionOutput implements DeleteTransactionUseCaseOutput {
	@Field(() => Boolean)
	success!: boolean;
}
