import { GraphQLError } from "graphql";
import type { MiddlewareFn } from "type-graphql";
import type { GraphqlContext } from "../context";

export const isAuth: MiddlewareFn<GraphqlContext> = async (
	{ context },
	next,
) => {
	if (!context.user || !context.token) {
		throw new GraphQLError("Not authenticated", {
			extensions: {
				code: "UNAUTHENTICATED",
			},
		});
	}

	return next();
};
