import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "./transaction.model";

@ObjectType()
export class CategoryTotalModel {
	@Field(() => ID)
	categoryId!: string;

	@Field(() => String)
	categoryName!: string;

	@Field(() => String)
	icon!: string;

	@Field(() => String)
	color!: string;

	@Field(() => Float)
	total!: number;

	@Field(() => Int)
	transactionsCount!: number;
}

@ObjectType()
export class DashboardModel {
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
