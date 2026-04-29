import { describe, expect, it, mock } from "bun:test";
import { ListTransactionsUseCase } from "~/application/use-cases/list-transactions/list-transactions.use-case";
import type { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";

describe("ListTransactionsUseCase", () => {
	it("should return transactions from repository", async () => {
		const transactions = [
			{
				id: "trx-1",
				title: "Salary",
				amount: 5000,
				type: "INCOME",
				description: "monthly",
				occurredAt: new Date(),
				userId: "user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		const repository = {
			findManyByUserId: mock(async () => transactions),
		} as unknown as PrismaTransactionRepository;

		const useCase = new ListTransactionsUseCase(repository);
		const result = await useCase.execute({ userId: "user-1" });

		expect(result.transactions).toEqual(transactions);
	});
});
