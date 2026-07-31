import { Field, Float, ObjectType } from "type-graphql";
import type { GetDashboardUseCaseOutput } from "~/application/dtos/get-dashboard.use-case.output";
import { CategoryTotalModel } from "~/domain/dashboard.model";
import { TransactionModel } from "~/domain/transaction.model";

@ObjectType()
export class DashboardOutput implements GetDashboardUseCaseOutput {
	@Field(() => Float)
	totalBalance!: number;

	@Field(() => Float)
	monthlyIncome!: number;

	@Field(() => Float)
	monthlyExpense!: number;

	@Field(() => [TransactionModel])
	lastTransactions!: TransactionModel[];

	@Field(() => [CategoryTotalModel])
	categoryTotals!: CategoryTotalModel[];
}
