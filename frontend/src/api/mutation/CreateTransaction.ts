import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"
import type { Transaction, TransactionType } from "@/types"

export interface CreateTransactionInput {
	description: string
	amount: number
	type: TransactionType
	categoryId?: string
	occurredAt?: string
}

type CreateTransactionMutation = {
	createTransaction: {
		transaction: Transaction
	}
}

type CreateTransactionMutationVariables = {
	data: CreateTransactionInput
}

export const CREATE_TRANSACTION: TypedDocumentNode<
	CreateTransactionMutation,
	CreateTransactionMutationVariables
> = gql`
	mutation CreateTransaction($data: CreateTransactionInput!) {
		createTransaction(data: $data) {
			transaction {
				id
				description
				amount
				type
				category {
					id
					name
				}
				occurredAt
				createdAt
				updatedAt
				userId
			}
		}
	}
`
