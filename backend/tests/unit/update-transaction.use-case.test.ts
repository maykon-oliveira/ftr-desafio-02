import { describe, expect, it, mock } from "bun:test";
import { UpdateTransactionUseCase } from "~/application/use-cases/update-transaction/update-transaction.use-case";
import { InvalidUpdateTransactionAmountError } from "~/application/use-cases/update-transaction/errors/invalid-update-transaction-amount.error";
import { InvalidUpdateTransactionTitleError } from "~/application/use-cases/update-transaction/errors/invalid-update-transaction-title.error";
import { TransactionNotFoundError } from "~/application/use-cases/update-transaction/errors/transaction-not-found.error";
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

		const useCase = new UpdateTransactionUseCase(repository);

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
		const useCase = new UpdateTransactionUseCase(repository);

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
		const useCase = new UpdateTransactionUseCase(repository);

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
		const useCase = new UpdateTransactionUseCase(repository);

		await expect(
			useCase.execute({
				id: "trx-404",
				userId: "user-1",
				title: "Valid title",
			}),
		).rejects.toBeInstanceOf(TransactionNotFoundError);
	});
});
