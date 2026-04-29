import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import express from "express";
import type { Server as HttpServer } from "node:http";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@as-integrations/express5";
import { AuthResolver } from "./infra/graphql/resolvers/auth.resolver";
import { UserResolver } from "./infra/graphql/resolvers/user.resolver";
import { TransactionResolver } from "./infra/graphql/resolvers/transaction.resolver";
import { CategoryResolver } from "./infra/graphql/resolvers/category.resolver";
import { Container } from "typedi";
import {
	createGraphqlContext,
	type GraphqlContext,
} from "./infra/graphql/context";

export const createApp = async () => {
	const app = express();

	const schema = await buildSchema({
		resolvers: [
			AuthResolver,
			UserResolver,
			TransactionResolver,
			CategoryResolver,
		],
		validate: false,
		emitSchemaFile: "./src/infra/schema/schema.graphql",
		container: Container,
	});

	const server = new ApolloServer<GraphqlContext>({
		schema,
	});

	await server.start();

	app.use(
		"/graphql",
		express.json(),
		expressMiddleware(server, {
			context: createGraphqlContext,
		}),
	);

	return {
		app,
		server,
	};
};

export const startServer = async (
	port = 4000,
): Promise<{
	app: express.Express;
	server: ApolloServer<GraphqlContext>;
	httpServer: HttpServer;
}> => {
	const { app, server } = await createApp();

	const httpServer = app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}/graphql`);
	});

	return {
		app,
		server,
		httpServer,
	};
};

if (import.meta.main) {
	startServer().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
