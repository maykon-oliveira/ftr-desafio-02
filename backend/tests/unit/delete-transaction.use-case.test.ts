import { describe, expect, it, mock } from "bun:test";
import { DeleteTransactionUseCase } from "~/application/use-cases/delete-transaction/delete-transaction.use-case";
import { TransactionNotFoundError } from "~/application/use-cases/delete-transaction/errors/transaction-not-found.error";
import type { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";

describe("DeleteTransactionUseCase", () => {
	it("should delete transaction successfully", async () => {
		const repository = {
			deleteByIdAndUserId: mock(async () => true),
		} as unknown as PrismaTransactionRepository;

		const useCase = new DeleteTransactionUseCase(repository);
		const result = await useCase.execute({
			id: "trx-1",
			userId: "user-1",
		});

		expect(result.success).toBe(true);
	});

	it("should throw when transaction does not exist", async () => {
		const repository = {
			deleteByIdAndUserId: mock(async () => false),
		} as unknown as PrismaTransactionRepository;

		const useCase = new DeleteTransactionUseCase(repository);

		await expect(
			useCase.execute({ id: "missing", userId: "user-1" }),
		).rejects.toBeInstanceOf(TransactionNotFoundError);
	});
});
