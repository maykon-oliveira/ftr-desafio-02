import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"

export interface UpdateCategoryInput {
	name?: string
	description?: string
	icon?: string
	color?: string
}

type UpdateCategoryMutation = {
	updateCategory: {
		category: {
			id: string
			name: string
			description?: string
			icon: string
			color: string
			userId: string
			createdAt: string
			updatedAt: string
		}
	}
}

type UpdateCategoryMutationVariables = {
	id: string
	data: UpdateCategoryInput
}

export const UPDATE_CATEGORY: TypedDocumentNode<
	UpdateCategoryMutation,
	UpdateCategoryMutationVariables
> = gql`
	mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
		updateCategory(id: $id, data: $data) {
			category {
				id
				name
				description
				icon
				color
				userId
				createdAt
				updatedAt
			}
		}
	}
`
