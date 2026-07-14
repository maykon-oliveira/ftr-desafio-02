import type { LoginInput, User } from "@/types";
import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client";

type LoginMutation = {
  login: {
    token: string;
    user: User
  };
};

type LoginMutationVariables = {
  data: LoginInput;
};

export const LOGIN: TypedDocumentNode<
  LoginMutation,
  LoginMutationVariables
> = gql`
	mutation Login($data: LoginUserInput!) {
    login(data: $data) {
      token
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