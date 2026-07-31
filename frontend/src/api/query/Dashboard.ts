import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"
import type { DashboardData } from "@/types"

type DashboardQuery = {
	dashboard: DashboardData
}

export const DASHBOARD: TypedDocumentNode<DashboardQuery> = gql`
	query Dashboard {
		dashboard {
			totalBalance
			monthlyIncome
			monthlyExpense
			lastTransactions {
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
			categoryTotals {
				categoryId
				categoryName
				icon
				color
				total
				transactionsCount
			}
		}
	}
`
