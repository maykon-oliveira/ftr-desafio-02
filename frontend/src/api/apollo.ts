import { useAuthStore } from "@/store/auth";
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, CombinedGraphQLErrors } from "@apollo/client"
import { ErrorLink } from "@apollo/client/link/error"
import { SetContextLink } from "@apollo/client/link/context"

const httpLink = new HttpLink({
	uri: "http://localhost:4000/graphql"
})

const authLink = new SetContextLink((prevContext) => {
	const token = useAuthStore.getState().token
	return {
		headers: {
			...prevContext.headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const isUnauthorizedError = (error: { extensions?: { code?: string }; message?: string }) => {
	const code = error?.extensions?.code;
	const message = error?.message?.toLowerCase() ?? "";

	return code === "UNAUTHENTICATED" || code === "TOKEN_EXPIRED" || message.includes("not authenticated") || message.includes("token expired");
};

const errorLink = new ErrorLink(({ error }) => {
	if (CombinedGraphQLErrors.is(error) && error.errors.some(isUnauthorizedError)) {
		console.log(error.errors);
		useAuthStore.getState().logout();
	}
});

export const api = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, httpLink]),
	cache: new InMemoryCache()
})