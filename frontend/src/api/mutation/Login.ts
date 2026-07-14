import type { LoginInput, User } from "@/types";
import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client";

type LoginMutation = {
	login: {
		token: string;
		user: User
	};
};
export const LOGIN: TypedDocumentNode<
	LoginMutation,
	LoginInput
> = gql`
	mutation Login($data: LoginUserInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
        role
		createdAt
		updatedAt
      }
    }
  }
`;