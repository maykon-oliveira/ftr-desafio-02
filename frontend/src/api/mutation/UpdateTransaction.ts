import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"
import type { Transaction, TransactionType } from "@/types"

export interface UpdateTransactionInput {
	description?: string
	amount?: number
	type?: TransactionType
	categoryId?: string
	occurredAt?: string
}

type UpdateTransactionMutation = {
	updateTransaction: {
		transaction: Transaction
	}
}

type UpdateTransactionMutationVariables = {
	id: string
	data: UpdateTransactionInput
}

export const UPDATE_TRANSACTION: TypedDocumentNode<
	UpdateTransactionMutation,
	UpdateTransactionMutationVariables
> = gql`
	mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) {
		updateTransaction(id: $id, data: $data) {
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
