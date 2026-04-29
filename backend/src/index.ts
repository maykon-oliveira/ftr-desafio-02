import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import express from "express";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@as-integrations/express5";
import { AuthResolver } from "./infra/graphql/resolvers/auth.resolver";
import { UserResolver } from "./infra/graphql/resolvers/user.resolver";
import { TransactionResolver } from "./infra/graphql/resolvers/transaction.resolver";
import { Container } from "typedi";
import {
	createGraphqlContext,
	type GraphqlContext,
} from "./infra/graphql/context";

async function main() {
	const app = express();

	const schema = await buildSchema({
		resolvers: [AuthResolver, UserResolver, TransactionResolver],
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

	app.listen(4000, () => {
		console.log("Server is running on http://localhost:4000/graphql");
	});
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
