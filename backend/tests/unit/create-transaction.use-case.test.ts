import { describe, expect, it, mock } from "bun:test";
import { CreateTransactionUseCase } from "~/application/use-cases/create-transaction/create-transaction.use-case";
import { InvalidTransactionAmountError } from "~/application/use-cases/create-transaction/errors/invalid-transaction-amount.error";
import { InvalidTransactionCategoryError } from "~/application/use-cases/create-transaction/errors/invalid-transaction-category.error";
import { InvalidTransactionTitleError } from "~/application/use-cases/create-transaction/errors/invalid-transaction-title.error";
import type { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import type { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";

describe("CreateTransactionUseCase", () => {
	it("should normalize data and create transaction", async () => {
		const create = mock(
			async (input: {
				title: string;
				amount: number;
				type: "INCOME" | "EXPENSE";
				description?: string;
				occurredAt?: Date;
				categoryId?: string;
				userId: string;
			}) => ({
				id: "trx-1",
				...input,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);

		const repository = {
			create,
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateTransactionUseCase(
			repository,
			categoryRepository,
		);
		const result = await useCase.execute({
			title: "  Grocery ",
			amount: 100,
			type: "EXPENSE",
			description: "  market ",
			userId: "user-1",
		});

		expect(create).toHaveBeenCalledWith({
			title: "Grocery",
			amount: 100,
			type: "EXPENSE",
			description: "market",
			userId: "user-1",
		});
		expect(result.transaction.id).toBe("trx-1");
	});

	it("should throw when title is empty", async () => {
		const repository = {
			create: mock(async () => {
				throw new Error("should not create");
			}),
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateTransactionUseCase(
			repository,
			categoryRepository,
		);

		await expect(
			useCase.execute({
				title: "   ",
				amount: 10,
				type: "EXPENSE",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(InvalidTransactionTitleError);
	});

	it("should throw when amount is invalid", async () => {
		const repository = {
			create: mock(async () => {
				throw new Error("should not create");
			}),
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateTransactionUseCase(
			repository,
			categoryRepository,
		);

		await expect(
			useCase.execute({
				title: "Grocery",
				amount: 0,
				type: "EXPENSE",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(InvalidTransactionAmountError);
	});

	it("should throw when category does not belong to user", async () => {
		const repository = {
			create: mock(async () => {
				throw new Error("should not create");
			}),
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateTransactionUseCase(
			repository,
			categoryRepository,
		);

		await expect(
			useCase.execute({
				title: "Grocery",
				amount: 50,
				type: "EXPENSE",
				categoryId: "cat-404",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(InvalidTransactionCategoryError);
	});

	it("should create transaction with valid category", async () => {
		const create = mock(
			async (input: {
				title: string;
				amount: number;
				type: "INCOME" | "EXPENSE";
				description?: string;
				occurredAt?: Date;
				categoryId?: string;
				userId: string;
			}) => ({
				id: "trx-2",
				...input,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);

		const repository = {
			create,
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => ({
				id: "cat-1",
				name: "Food",
				userId: "user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateTransactionUseCase(
			repository,
			categoryRepository,
		);

		const result = await useCase.execute({
			title: "Dinner",
			amount: 80,
			type: "EXPENSE",
			categoryId: "cat-1",
			userId: "user-1",
		});

		expect(create).toHaveBeenCalledWith({
			title: "Dinner",
			amount: 80,
			type: "EXPENSE",
			categoryId: "cat-1",
			userId: "user-1",
		});
		expect(result.transaction.categoryId).toBe("cat-1");
	});
});
