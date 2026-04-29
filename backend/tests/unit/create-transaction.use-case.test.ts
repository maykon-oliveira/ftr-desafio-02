import { describe, expect, it, mock } from "bun:test";
import { CreateTransactionUseCase } from "~/application/use-cases/create-transaction/create-transaction.use-case";
import { InvalidTransactionAmountError } from "~/application/use-cases/create-transaction/errors/invalid-transaction-amount.error";
import { InvalidTransactionTitleError } from "~/application/use-cases/create-transaction/errors/invalid-transaction-title.error";
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

		const useCase = new CreateTransactionUseCase(repository);
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

		const useCase = new CreateTransactionUseCase(repository);

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

		const useCase = new CreateTransactionUseCase(repository);

		await expect(
			useCase.execute({
				title: "Grocery",
				amount: 0,
				type: "EXPENSE",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(InvalidTransactionAmountError);
	});
});
