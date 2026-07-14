import type { RegisterUserInput, User } from "@/types";
import { gql } from "@apollo/client"
import type { TypedDocumentNode } from "@apollo/client";

type RegisterMutation = {
  registerUser: {
    token: string;
    user: User
  };
};

type RegisterMutationVariables = {
  data: RegisterUserInput;
};

export const REGISTER: TypedDocumentNode<
  RegisterMutation,
  RegisterMutationVariables
> = gql`
  mutation Register($data: RegisterUserInput!) {
    registerUser(data: $data) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`