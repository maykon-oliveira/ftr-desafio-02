import type { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { verifyJwt } from "~/infra/security/jwt";

export type GraphqlContext = {
	user: string | undefined;
	token: string | undefined;
};

const getTokenFromAuthorizationHeader = (
	authorizationHeader: string | undefined,
): string | undefined => {
	if (!authorizationHeader) {
		return undefined;
	}

	const [scheme, token] = authorizationHeader.split(" ");

	if (scheme !== "Bearer" || !token) {
		return undefined;
	}

	return token;
};

export const createGraphqlContext = async ({
	req,
	res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
	const authorizationHeader = req.headers.authorization;

	const token = getTokenFromAuthorizationHeader(authorizationHeader);

	if (!token) {
		return {
			user: undefined,
			token: undefined,
		};
	}

	try {
		const payload = verifyJwt(token);

		return {
			user: payload.id,
			token,
		};
	} catch (error) {
		console.error(error);

		return {
			user: undefined,
			token: undefined,
		};
	}
};
