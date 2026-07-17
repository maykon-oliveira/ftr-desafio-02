import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"

type DeleteCategoryMutation = {
	deleteCategory: {
		success: boolean
	}
}

type DeleteCategoryMutationVariables = {
	id: string
}

export const DELETE_CATEGORY: TypedDocumentNode<
	DeleteCategoryMutation,
	DeleteCategoryMutationVariables
> = gql`
	mutation DeleteCategory($id: String!) {
		deleteCategory(id: $id) {
			success
		}
	}
`
