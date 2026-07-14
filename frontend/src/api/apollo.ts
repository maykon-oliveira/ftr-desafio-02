import { useAuthStore } from "@/store/auth";
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from "@apollo/client"
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

export const api = new ApolloClient({
	link: ApolloLink.from([authLink, httpLink]),
	cache: new InMemoryCache()
})