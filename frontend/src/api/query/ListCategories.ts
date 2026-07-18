import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"
import type { Category } from "@/types"

type ListCategoriesQuery = {
	listCategories: {
		categories: Category[]
	}
}

export const LIST_CATEGORIES: TypedDocumentNode<ListCategoriesQuery> = gql`
	query ListCategories {
		listCategories {
			categories {
				id
				name
				description
				icon
				color
				transactionsCount
			}
		}
	}
`
