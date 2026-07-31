import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"
import type { Transaction, TransactionType } from "@/types"

export interface TransactionFilters {
	description?: string
	type?: TransactionType
	categoryId?: string
	month?: number
	year?: number
}

type ListTransactionsQuery = {
	listTransactions: {
		transactions: Transaction[]
	}
}

type ListTransactionsQueryVariables = {
	filter?: TransactionFilters
}

export const LIST_TRANSACTIONS: TypedDocumentNode<ListTransactionsQuery, ListTransactionsQueryVariables> = gql`
	query ListTransactions($filter: ListTransactionsFilter) {
		listTransactions(filter: $filter) {
			transactions {
				id
				description
				amount
				type
				category {
					id
					name
					icon
					color
				}
				occurredAt
				createdAt
				updatedAt
				userId
			}
		}
	}
`
