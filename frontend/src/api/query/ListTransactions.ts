import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"
import type { Transaction } from "@/types"

type ListTransactionsQuery = {
	listTransactions: {
		transactions: Transaction[]
	}
}

export const LIST_TRANSACTIONS: TypedDocumentNode<ListTransactionsQuery> = gql`
	query ListTransactions {
		listTransactions {
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
