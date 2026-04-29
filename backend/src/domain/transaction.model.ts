import {
	Field,
	Float,
	GraphQLISODateTime,
	ID,
	ObjectType,
	registerEnumType,
} from "type-graphql";

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
	title!: string;

	@Field(() => Float)
	amount!: number;

	@Field(() => TransactionType)
	type!: TransactionType;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => GraphQLISODateTime)
	occurredAt!: Date;

	@Field(() => String)
	userId!: string;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt!: Date;
}
