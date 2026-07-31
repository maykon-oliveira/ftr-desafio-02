import type { User } from "@/types";
import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";

export interface UpdateUserInput {
	name: string;
}

type UpdateUserMutation = {
	updateUser: {
		user: User;
	};
};

type UpdateUserMutationVariables = {
	data: UpdateUserInput;
};

export const UPDATE_USER: TypedDocumentNode<
	UpdateUserMutation,
	UpdateUserMutationVariables
> = gql`
	mutation UpdateUser($data: UpdateUserInput!) {
		updateUser(data: $data) {
			user {
				id
				name
				email
				createdAt
				updatedAt
			}
		}
	}
`;
