import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { CreateTransactionUseCase } from "~/application/use-cases/create-transaction/create-transaction.use-case";
import { isAuth } from "../middleware/auth.middleware";
import type { GraphqlContext } from "../context";
import { CreateTransactionInput } from "../inputs/create-transaction.input";
import { CreateTransactionOutput } from "../outputs/create-transaction.output";

@Service()
@Resolver()
export class TransactionResolver {
	constructor(
		private readonly createTransactionUseCase: CreateTransactionUseCase,
	) {}

	@Mutation(() => CreateTransactionOutput)
	@UseMiddleware(isAuth)
	async createTransaction(
		@Arg("data", () => CreateTransactionInput) input: CreateTransactionInput,
		@Ctx() context: GraphqlContext,
	): Promise<CreateTransactionOutput> {
		return this.createTransactionUseCase.execute({
			...input,
			userId: context.user!,
		});
	}
}
