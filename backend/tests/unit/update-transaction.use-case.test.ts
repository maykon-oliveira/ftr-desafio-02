import { describe, expect, it, mock } from "bun:test";
import { UpdateTransactionUseCase } from "~/application/use-cases/update-transaction/update-transaction.use-case";
import { InvalidUpdateTransactionAmountError } from "~/application/use-cases/update-transaction/errors/invalid-update-transaction-amount.error";
import { InvalidUpdateTransactionCategoryError } from "~/application/use-cases/update-transaction/errors/invalid-update-transaction-category.error";
import { InvalidUpdateTransactionTitleError } from "~/application/use-cases/update-transaction/errors/invalid-update-transaction-description.error";
import { TransactionNotFoundError } from "~/application/use-cases/update-transaction/errors/transaction-not-found.error";
import type { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import type { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";

describe("UpdateTransactionUseCase", () => {
	it("should normalize fields and update transaction", async () => {
		const updateByIdAndUserId = mock(async () => ({
			id: "trx-1",
			title: "Updated",
			amount: 99.9,
			type: "EXPENSE",
			description: "new",
			occurredAt: new Date(),
			userId: "user-1",
			createdAt: new Date(),
			updatedAt: new Date(),
		}));

		const repository = {
			updateByIdAndUserId,
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;

		const useCase = new UpdateTransactionUseCase(
			repository,
			categoryRepository,
		);

		const result = await useCase.execute({
			id: "trx-1",
			userId: "user-1",
			title: "  Updated ",
			amount: 99.9,
			description: "  new ",
		});

		expect(updateByIdAndUserId).toHaveBeenCalledWith({
			id: "trx-1",
			userId: "user-1",
			title: "Updated",
			amount: 99.9,
			description: "new",
		});
		expect(result.transaction.id).toBe("trx-1");
	});

	it("should throw when title becomes empty", async () => {
		const repository = {
			updateByIdAndUserId: mock(async () => null),
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;
		const useCase = new UpdateTransactionUseCase(
			repository,
			categoryRepository,
		);

		await expect(
			useCase.execute({
				id: "trx-1",
				userId: "user-1",
				title: "   ",
			}),
		).rejects.toBeInstanceOf(InvalidUpdateTransactionTitleError);
	});

	it("should throw when amount is invalid", async () => {
		const repository = {
			updateByIdAndUserId: mock(async () => null),
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;
		const useCase = new UpdateTransactionUseCase(
			repository,
			categoryRepository,
		);

		await expect(
			useCase.execute({
				id: "trx-1",
				userId: "user-1",
				amount: 0,
			}),
		).rejects.toBeInstanceOf(InvalidUpdateTransactionAmountError);
	});

	it("should throw when transaction is not found", async () => {
		const repository = {
			updateByIdAndUserId: mock(async () => null),
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;
		const useCase = new UpdateTransactionUseCase(
			repository,
			categoryRepository,
		);

		await expect(
			useCase.execute({
				id: "trx-404",
				userId: "user-1",
				title: "Valid title",
			}),
		).rejects.toBeInstanceOf(TransactionNotFoundError);
	});

	it("should throw when category does not belong to user", async () => {
		const repository = {
			updateByIdAndUserId: mock(async () => null),
		} as unknown as PrismaTransactionRepository;
		const categoryRepository = {
			findByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;
		const useCase = new UpdateTransactionUseCase(
			repository,
			categoryRepository,
		);

		await expect(
			useCase.execute({
				id: "trx-1",
				userId: "user-1",
				categoryId: "cat-404",
			}),
		).rejects.toBeInstanceOf(InvalidUpdateTransactionCategoryError);
	});

	it("should update transaction with valid category", async () => {
		const updateByIdAndUserId = mock(async () => ({
			id: "trx-1",
			title: "Updated",
			amount: 99.9,
			type: "EXPENSE",
			description: "new",
			occurredAt: new Date(),
			userId: "user-1",
			categoryId: "cat-1",
			createdAt: new Date(),
			updatedAt: new Date(),
		}));

		const repository = {
			updateByIdAndUserId,
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
		const useCase = new UpdateTransactionUseCase(
			repository,
			categoryRepository,
		);

		const result = await useCase.execute({
			id: "trx-1",
			userId: "user-1",
			categoryId: "cat-1",
		});

		expect(updateByIdAndUserId).toHaveBeenCalledWith({
			id: "trx-1",
			userId: "user-1",
			categoryId: "cat-1",
			title: undefined,
			description: undefined,
		});
		expect(result.transaction.categoryId).toBe("cat-1");
	});
});
