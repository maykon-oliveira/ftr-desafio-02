import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"

export interface CreateCategoryInput {
	name: string
	description?: string
	icon: string
	color: string
}

type CreateCategoryMutation = {
	createCategory: {
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

type CreateCategoryMutationVariables = {
	data: CreateCategoryInput
}

export const CREATE_CATEGORY: TypedDocumentNode<
	CreateCategoryMutation,
	CreateCategoryMutationVariables
> = gql`
	mutation CreateCategory($data: CreateCategoryInput!) {
		createCategory(data: $data) {
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
