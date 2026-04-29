import "reflect-metadata";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "bun:test";
import type { Server } from "node:http";
import { startServer } from "~/index";
import { prisma } from "~/infra/db/prisma";
import { Container } from "typedi";
import { PrismaUserRepository } from "~/application/ports/prisma-user.repository";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import { BcryptPasswordHasher } from "~/application/ports/bcrypt-password-hasher";
import { RegisterUserUseCase } from "~/application/use-cases/register-user/register-user.use-case";
import { LoginUserUseCase } from "~/application/use-cases/login-user/login-user.use-case";
import { GetUserByIdUseCase } from "~/application/use-cases/get-user-by-id/get-user-by-id.use-case";
import { CreateTransactionUseCase } from "~/application/use-cases/create-transaction/create-transaction.use-case";
import { UpdateTransactionUseCase } from "~/application/use-cases/update-transaction/update-transaction.use-case";
import { DeleteTransactionUseCase } from "~/application/use-cases/delete-transaction/delete-transaction.use-case";
import { ListTransactionsUseCase } from "~/application/use-cases/list-transactions/list-transactions.use-case";
import { CreateCategoryUseCase } from "~/application/use-cases/create-category/create-category.use-case";
import { ListCategoriesUseCase } from "~/application/use-cases/list-categories/list-categories.use-case";
import { UpdateCategoryUseCase } from "~/application/use-cases/update-category/update-category.use-case";
import { DeleteCategoryUseCase } from "~/application/use-cases/delete-category/delete-category.use-case";
import { AuthResolver } from "~/infra/graphql/resolvers/auth.resolver";
import { UserResolver } from "~/infra/graphql/resolvers/user.resolver";
import { TransactionResolver } from "~/infra/graphql/resolvers/transaction.resolver";
import { CategoryResolver } from "~/infra/graphql/resolvers/category.resolver";

Bun.env.JWT_SECRET = Bun.env.JWT_SECRET ?? "test-secret";
Bun.env.DATABASE_URL = Bun.env.DATABASE_URL ?? "file:./dev.db";

const TEST_EMAIL_PREFIX = "e2e-test-financy-";

let httpServer: Server;
let graphQlUrl = "";
let stopApollo: (() => Promise<void>) | null = null;

const graphqlRequest = async <T>(
	query: string,
	variables?: Record<string, unknown>,
	token?: string,
): Promise<{ data?: T; errors?: Array<{ message: string }> }> => {
	const response = await fetch(graphQlUrl, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...(token ? { authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({ query, variables }),
	});

	return (await response.json()) as {
		data?: T;
		errors?: Array<{ message: string }>;
	};
};

const registerUser = async () => {
	const email = `${TEST_EMAIL_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}@mail.com`;
	const result = await graphqlRequest<{
		registerUser: {
			token: string;
			user: { id: string; email: string };
		};
	}>(
		`mutation Register($data: RegisterUserInput!) {
			registerUser(data: $data) {
				token
				user {
					id
					email
				}
			}
		}`,
		{
			data: {
				name: "E2E User",
				email,
				password: "123456",
			},
		},
	);

	expect(result.errors).toBeUndefined();
	expect(typeof result.data?.registerUser.token).toBe("string");

	return {
		token: result.data!.registerUser.token,
		userId: result.data!.registerUser.user.id,
	};
};

beforeAll(async () => {
	Container.reset();

	const userRepository = new PrismaUserRepository();
	const transactionRepository = new PrismaTransactionRepository();
	const categoryRepository = new PrismaCategoryRepository();
	const passwordHasher = new BcryptPasswordHasher();

	const registerUserUseCase = new RegisterUserUseCase(
		userRepository,
		passwordHasher,
	);
	const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher);
	const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
	const createTransactionUseCase = new CreateTransactionUseCase(
		transactionRepository,
	);
	const updateTransactionUseCase = new UpdateTransactionUseCase(
		transactionRepository,
	);
	const deleteTransactionUseCase = new DeleteTransactionUseCase(
		transactionRepository,
	);
	const listTransactionsUseCase = new ListTransactionsUseCase(
		transactionRepository,
	);
	const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
	const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
	const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
	const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

	Container.set(PrismaUserRepository, userRepository);
	Container.set(PrismaTransactionRepository, transactionRepository);
	Container.set(PrismaCategoryRepository, categoryRepository);
	Container.set(BcryptPasswordHasher, passwordHasher);
	Container.set(RegisterUserUseCase, registerUserUseCase);
	Container.set(LoginUserUseCase, loginUserUseCase);
	Container.set(GetUserByIdUseCase, getUserByIdUseCase);
	Container.set(CreateTransactionUseCase, createTransactionUseCase);
	Container.set(UpdateTransactionUseCase, updateTransactionUseCase);
	Container.set(DeleteTransactionUseCase, deleteTransactionUseCase);
	Container.set(ListTransactionsUseCase, listTransactionsUseCase);
	Container.set(CreateCategoryUseCase, createCategoryUseCase);
	Container.set(ListCategoriesUseCase, listCategoriesUseCase);
	Container.set(UpdateCategoryUseCase, updateCategoryUseCase);
	Container.set(DeleteCategoryUseCase, deleteCategoryUseCase);
	Container.set(
		AuthResolver,
		new AuthResolver(registerUserUseCase, loginUserUseCase),
	);
	Container.set(UserResolver, new UserResolver(getUserByIdUseCase));
	Container.set(
		TransactionResolver,
		new TransactionResolver(
			createTransactionUseCase,
			deleteTransactionUseCase,
			listTransactionsUseCase,
			updateTransactionUseCase,
		),
	);
	Container.set(
		CategoryResolver,
		new CategoryResolver(
			createCategoryUseCase,
			deleteCategoryUseCase,
			listCategoriesUseCase,
			updateCategoryUseCase,
		),
	);

	const started = await startServer(0);
	httpServer = started.httpServer;
	stopApollo = () => started.server.stop();

	const address = httpServer.address();
	if (!address || typeof address === "string") {
		throw new Error("Could not determine test server address");
	}

	graphQlUrl = `http://127.0.0.1:${address.port}/graphql`;
});

afterEach(async () => {
	await prisma.user.deleteMany({
		where: {
			email: {
				startsWith: TEST_EMAIL_PREFIX,
			},
		},
	});
});

afterAll(async () => {
	await prisma.user.deleteMany({
		where: {
			email: {
				startsWith: TEST_EMAIL_PREFIX,
			},
		},
	});

	await stopApollo?.();

	if (httpServer) {
		await new Promise<void>((resolve, reject) => {
			httpServer.close((error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}

	await prisma.$disconnect();
	Container.reset();
});

describe("Auth e2e", () => {
	it("should register a new user and return token", async () => {
		const email = `${TEST_EMAIL_PREFIX}register-${Date.now()}@mail.com`;

		const result = await graphqlRequest<{
			registerUser: {
				token: string;
				refreshToken: string;
				user: { id: string; email: string; name: string };
			};
		}>(
			`mutation Register($data: RegisterUserInput!) {
				registerUser(data: $data) {
					token
					refreshToken
					user {
						id
						email
						name
					}
				}
			}`,
			{ data: { name: "Register Test", email, password: "123456" } },
		);

		expect(result.errors).toBeUndefined();
		expect(typeof result.data?.registerUser.token).toBe("string");
		expect(typeof result.data?.registerUser.refreshToken).toBe("string");
		expect(result.data?.registerUser.user.email).toBe(email);
		expect(result.data?.registerUser.user.name).toBe("Register Test");
	});

	it("should reject registration with duplicate email", async () => {
		const email = `${TEST_EMAIL_PREFIX}dup-${Date.now()}@mail.com`;

		await graphqlRequest(
			`mutation Register($data: RegisterUserInput!) { registerUser(data: $data) { token } }`,
			{ data: { name: "First", email, password: "123456" } },
		);

		const result = await graphqlRequest(
			`mutation Register($data: RegisterUserInput!) { registerUser(data: $data) { token } }`,
			{ data: { name: "Second", email, password: "123456" } },
		);

		expect(result.errors?.[0]?.message).toInclude("Email already in use");
	});

	it("should login with valid credentials and return token", async () => {
		const email = `${TEST_EMAIL_PREFIX}login-${Date.now()}@mail.com`;

		await graphqlRequest(
			`mutation Register($data: RegisterUserInput!) { registerUser(data: $data) { token } }`,
			{ data: { name: "Login Test", email, password: "mypassword" } },
		);

		const result = await graphqlRequest<{
			login: { token: string; refreshToken: string; user: { id: string } };
		}>(
			`mutation Login($data: LoginUserInput!) {
				login(data: $data) {
					token
					refreshToken
					user {
						id
					}
				}
			}`,
			{ data: { email, password: "mypassword" } },
		);

		expect(result.errors).toBeUndefined();
		expect(typeof result.data?.login.token).toBe("string");
		expect(typeof result.data?.login.refreshToken).toBe("string");
		expect(typeof result.data?.login.user.id).toBe("string");
	});

	it("should reject login with wrong password", async () => {
		const email = `${TEST_EMAIL_PREFIX}wrongpw-${Date.now()}@mail.com`;

		await graphqlRequest(
			`mutation Register($data: RegisterUserInput!) { registerUser(data: $data) { token } }`,
			{ data: { name: "WrongPw", email, password: "correct" } },
		);

		const result = await graphqlRequest(
			`mutation Login($data: LoginUserInput!) { login(data: $data) { token } }`,
			{ data: { email, password: "wrong" } },
		);

		expect(result.errors?.[0]?.message).toInclude("Invalid credentials");
	});

	it("should reject login with unknown email", async () => {
		const result = await graphqlRequest(
			`mutation Login($data: LoginUserInput!) { login(data: $data) { token } }`,
			{
				data: {
					email: `${TEST_EMAIL_PREFIX}nobody-${Date.now()}@mail.com`,
					password: "123456",
				},
			},
		);

		expect(result.errors?.[0]?.message).toInclude("Invalid credentials");
	});
});

describe("User e2e", () => {
	it("should return authenticated user data via getUser", async () => {
		const { token, userId } = await registerUser();

		const result = await graphqlRequest<{
			getUser: { id: string; name: string; email: string };
		}>(
			`query GetUser($id: String!) {
				getUser(id: $id) {
					id
					name
					email
				}
			}`,
			{ id: userId },
			token,
		);

		expect(result.errors).toBeUndefined();
		expect(result.data?.getUser.id).toBe(userId);
		expect(typeof result.data?.getUser.name).toBe("string");
		expect(typeof result.data?.getUser.email).toBe("string");
	});

	it("should reject getUser without authentication", async () => {
		const result = await graphqlRequest(`query { getUser(id: "any") { id } }`);

		expect(result.errors?.[0]?.message).toBe("Not authenticated");
	});
});

describe("Category e2e", () => {
	it("should reject unauthenticated deleteCategory", async () => {
		const result = await graphqlRequest(
			`mutation DeleteCategory($id: String!) {
				deleteCategory(id: $id) {
					success
				}
			}`,
			{ id: "any-id" },
		);

		expect(result.errors?.[0]?.message).toBe("Not authenticated");
	});

	it("should create and delete category successfully", async () => {
		const { token } = await registerUser();

		const created = await graphqlRequest<{
			createCategory: { category: { id: string; name: string } };
		}>(
			`mutation CreateCategory($data: CreateCategoryInput!) {
				createCategory(data: $data) {
					category {
						id
						name
					}
				}
			}`,
			{ data: { name: "Food" } },
			token,
		);

		expect(created.errors).toBeUndefined();
		const categoryId = created.data?.createCategory.category.id;
		expect(typeof categoryId).toBe("string");

		const deleted = await graphqlRequest<{
			deleteCategory: { success: boolean };
		}>(
			`mutation DeleteCategory($id: String!) {
				deleteCategory(id: $id) {
					success
				}
			}`,
			{ id: categoryId },
			token,
		);

		expect(deleted.errors).toBeUndefined();
		expect(deleted.data?.deleteCategory.success).toBe(true);

		const listed = await graphqlRequest<{
			listCategories: { categories: Array<{ id: string; name: string }> };
		}>(
			`query {
				listCategories {
					categories {
						id
						name
					}
				}
			}`,
			undefined,
			token,
		);

		expect(listed.errors).toBeUndefined();
		expect(listed.data?.listCategories.categories).toHaveLength(0);
	});

	it("should reject deleting category from another user", async () => {
		const firstUser = await registerUser();
		const secondUser = await registerUser();

		const created = await graphqlRequest<{
			createCategory: { category: { id: string } };
		}>(
			`mutation CreateCategory($data: CreateCategoryInput!) {
				createCategory(data: $data) {
					category {
						id
					}
				}
			}`,
			{ data: { name: "Investments" } },
			firstUser.token,
		);

		expect(created.errors).toBeUndefined();
		const categoryId = created.data?.createCategory.category.id;

		const deleted = await graphqlRequest<{
			deleteCategory: { success: boolean };
		}>(
			`mutation DeleteCategory($id: String!) {
				deleteCategory(id: $id) {
					success
				}
			}`,
			{ id: categoryId },
			secondUser.token,
		);

		expect(deleted.data?.deleteCategory).toBeUndefined();
		expect(deleted.errors?.[0]?.message).toInclude("Category not found");
	});

	it("should list only categories from authenticated user", async () => {
		const firstUser = await registerUser();
		const secondUser = await registerUser();

		const firstCreated = await graphqlRequest(
			`mutation CreateCategory($data: CreateCategoryInput!) {
				createCategory(data: $data) {
					category {
						id
						name
					}
				}
			}`,
			{ data: { name: "Food" } },
			firstUser.token,
		);

		const secondCreated = await graphqlRequest(
			`mutation CreateCategory($data: CreateCategoryInput!) {
				createCategory(data: $data) {
					category {
						id
						name
					}
				}
			}`,
			{ data: { name: "Travel" } },
			secondUser.token,
		);

		expect(firstCreated.errors).toBeUndefined();
		expect(secondCreated.errors).toBeUndefined();

		const listed = await graphqlRequest<{
			listCategories: { categories: Array<{ id: string; name: string }> };
		}>(
			`query {
				listCategories {
					categories {
						id
						name
					}
				}
			}`,
			undefined,
			firstUser.token,
		);

		expect(listed.errors).toBeUndefined();
		expect(listed.data?.listCategories.categories).toHaveLength(1);
		expect(listed.data?.listCategories.categories[0]?.name).toBe("Food");
	});

	it("should update category successfully", async () => {
		const { token } = await registerUser();

		const created = await graphqlRequest<{
			createCategory: { category: { id: string; name: string } };
		}>(
			`mutation CreateCategory($data: CreateCategoryInput!) {
				createCategory(data: $data) {
					category {
						id
						name
					}
				}
			}`,
			{ data: { name: "Subscriptions" } },
			token,
		);

		expect(created.errors).toBeUndefined();
		const categoryId = created.data?.createCategory.category.id;

		const updated = await graphqlRequest<{
			updateCategory: { category: { id: string; name: string } };
		}>(
			`mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
				updateCategory(id: $id, data: $data) {
					category {
						id
						name
					}
				}
			}`,
			{ id: categoryId, data: { name: "Monthly Subscriptions" } },
			token,
		);

		expect(updated.errors).toBeUndefined();
		expect(updated.data?.updateCategory.category.id).toBe(categoryId);
		expect(updated.data?.updateCategory.category.name).toBe(
			"Monthly Subscriptions",
		);
	});

	it("should reject updating category from another user", async () => {
		const firstUser = await registerUser();
		const secondUser = await registerUser();

		const created = await graphqlRequest<{
			createCategory: { category: { id: string } };
		}>(
			`mutation CreateCategory($data: CreateCategoryInput!) {
				createCategory(data: $data) {
					category {
						id
					}
				}
			}`,
			{ data: { name: "Education" } },
			firstUser.token,
		);

		expect(created.errors).toBeUndefined();
		const categoryId = created.data?.createCategory.category.id;

		const updated = await graphqlRequest<{
			updateCategory: { category: { id: string; name: string } };
		}>(
			`mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
				updateCategory(id: $id, data: $data) {
					category {
						id
						name
					}
				}
			}`,
			{ id: categoryId, data: { name: "Courses" } },
			secondUser.token,
		);

		expect(updated.data?.updateCategory).toBeUndefined();
		expect(updated.errors?.[0]?.message).toInclude("Category not found");
	});
});

describe("GraphQL API e2e", () => {
	it("should reject unauthenticated listTransactions", async () => {
		const result = await graphqlRequest<{
			listTransactions: { transactions: Array<{ id: string }> };
		}>(`query { listTransactions { transactions { id } } }`);

		expect(result.data?.listTransactions).toBeUndefined();
		expect(result.errors?.[0]?.message).toBe("Not authenticated");
	});

	it("should create, list, update and delete a transaction", async () => {
		const { token } = await registerUser();

		const created = await graphqlRequest<{
			createTransaction: { transaction: { id: string; title: string } };
		}>(
			`mutation Create($data: CreateTransactionInput!) {
				createTransaction(data: $data) {
					transaction {
						id
						title
					}
				}
			}`,
			{
				data: {
					title: "Groceries",
					amount: 120.45,
					type: "EXPENSE",
					description: "Market",
				},
			},
			token,
		);

		expect(created.errors).toBeUndefined();
		const transactionId = created.data?.createTransaction.transaction.id;
		expect(typeof transactionId).toBe("string");

		const listed = await graphqlRequest<{
			listTransactions: {
				transactions: Array<{ id: string; title: string; amount: number }>;
			};
		}>(
			`query {
				listTransactions {
					transactions {
						id
						title
						amount
					}
				}
			}`,
			undefined,
			token,
		);

		expect(listed.errors).toBeUndefined();
		expect(listed.data?.listTransactions.transactions.length).toBe(1);
		expect(listed.data?.listTransactions.transactions[0]?.id).toBe(
			transactionId,
		);

		const updated = await graphqlRequest<{
			updateTransaction: {
				transaction: { id: string; title: string; amount: number };
			};
		}>(
			`mutation Update($id: String!, $data: UpdateTransactionInput!) {
				updateTransaction(id: $id, data: $data) {
					transaction {
						id
						title
						amount
					}
				}
			}`,
			{
				id: transactionId,
				data: {
					title: "Updated groceries",
					amount: 150,
				},
			},
			token,
		);

		expect(updated.errors).toBeUndefined();
		expect(updated.data?.updateTransaction.transaction.title).toBe(
			"Updated groceries",
		);
		expect(updated.data?.updateTransaction.transaction.amount).toBe(150);

		const deleted = await graphqlRequest<{
			deleteTransaction: { success: boolean };
		}>(
			`mutation Delete($id: String!) {
				deleteTransaction(id: $id) {
					success
				}
			}`,
			{ id: transactionId },
			token,
		);

		expect(deleted.errors).toBeUndefined();
		expect(deleted.data?.deleteTransaction.success).toBe(true);
	});
});
