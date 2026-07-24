import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client"

type DeleteTransactionMutation = {
	deleteTransaction: {
		success: boolean
	}
}

type DeleteTransactionMutationVariables = {
	id: string
}

export const DELETE_TRANSACTION: TypedDocumentNode<
	DeleteTransactionMutation,
	DeleteTransactionMutationVariables
> = gql`
	mutation DeleteTransaction($id: String!) {
		deleteTransaction(id: $id) {
			success
		}
	}
`
