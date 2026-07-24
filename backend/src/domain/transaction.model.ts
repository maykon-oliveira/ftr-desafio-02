import {
	Field,
	Float,
	GraphQLISODateTime,
	ID,
	ObjectType,
	registerEnumType,
} from "type-graphql";
import { CategoryModel } from "./category.model";

export enum TransactionType {
	INCOME = "INCOME",
	EXPENSE = "EXPENSE",
}

registerEnumType(TransactionType, {
	name: "TransactionType",
});

@ObjectType()
export class TransactionModel {
	@Field(() => ID)
	id!: string;

	@Field(() => String)
	description!: string;

	@Field(() => Float)
	amount!: number;

	@Field(() => TransactionType)
	type!: TransactionType;

	@Field(() => GraphQLISODateTime)
	occurredAt!: Date;

	@Field(() => String)
	userId!: string;

	// Internal — not exposed in GraphQL; used by the field resolver
	categoryId!: string;

	@Field(() => CategoryModel)
	category!: CategoryModel;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt!: Date;
}
