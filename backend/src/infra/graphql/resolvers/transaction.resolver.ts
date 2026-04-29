import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { CreateTransactionUseCase } from "~/application/use-cases/create-transaction/create-transaction.use-case";
import { DeleteTransactionUseCase } from "~/application/use-cases/delete-transaction/delete-transaction.use-case";
import { ListTransactionsUseCase } from "~/application/use-cases/list-transactions/list-transactions.use-case";
import { UpdateTransactionUseCase } from "~/application/use-cases/update-transaction/update-transaction.use-case";
import { isAuth } from "../middleware/auth.middleware";
import type { GraphqlContext } from "../context";
import { CreateTransactionInput } from "../inputs/create-transaction.input";
import { UpdateTransactionInput } from "../inputs/update-transaction.input";
import { CreateTransactionOutput } from "../outputs/create-transaction.output";
import { DeleteTransactionOutput } from "../outputs/delete-transaction.output";
import { ListTransactionsOutput } from "../outputs/list-transactions.output";
import { UpdateTransactionOutput } from "../outputs/update-transaction.output";

@Service()
@Resolver()
export class TransactionResolver {
	constructor(
		private readonly createTransactionUseCase: CreateTransactionUseCase,
		private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
		private readonly listTransactionsUseCase: ListTransactionsUseCase,
		private readonly updateTransactionUseCase: UpdateTransactionUseCase,
	) {}

	@Query(() => ListTransactionsOutput)
	@UseMiddleware(isAuth)
	async listTransactions(
		@Ctx() context: GraphqlContext,
	): Promise<ListTransactionsOutput> {
		return this.listTransactionsUseCase.execute({
			userId: context.user!,
		});
	}

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

	@Mutation(() => UpdateTransactionOutput)
	@UseMiddleware(isAuth)
	async updateTransaction(
		@Arg("id", () => String) id: string,
		@Arg("data", () => UpdateTransactionInput) input: UpdateTransactionInput,
		@Ctx() context: GraphqlContext,
	): Promise<UpdateTransactionOutput> {
		return this.updateTransactionUseCase.execute({
			id,
			...input,
			userId: context.user!,
		});
	}

	@Mutation(() => DeleteTransactionOutput)
	@UseMiddleware(isAuth)
	async deleteTransaction(
		@Arg("id", () => String) id: string,
		@Ctx() context: GraphqlContext,
	): Promise<DeleteTransactionOutput> {
		return this.deleteTransactionUseCase.execute({
			id,
			userId: context.user!,
		});
	}
}
