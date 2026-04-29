import type { CreateTransactionUseCaseInput } from "~/application/dtos/create-transaction.use-case.input";
import type { UpdateTransactionUseCaseInput } from "~/application/dtos/update-transaction.use-case.input";
import type { TransactionModel, TransactionType } from "~/domain/transaction.model";
import { prisma } from "~/infra/db/prisma";
import { Service } from "typedi";

@Service()
export class PrismaTransactionRepository {
	async create(input: CreateTransactionUseCaseInput): Promise<TransactionModel> {
		const transaction = await prisma.transaction.create({
			data: {
				title: input.title,
				amount: input.amount,
				type: input.type,
				description: input.description,
				occurredAt: input.occurredAt,
				userId: input.userId,
			},
		});

		return {
			id: transaction.id,
			title: transaction.title,
			amount: transaction.amount,
			type: transaction.type as TransactionType,
			description: transaction.description ?? undefined,
			occurredAt: transaction.occurredAt,
			userId: transaction.userId,
			createdAt: transaction.createdAt,
			updatedAt: transaction.updatedAt,
		};
	}

	async findManyByUserId(userId: string): Promise<TransactionModel[]> {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
			},
			orderBy: {
				occurredAt: "desc",
			},
		});

		return transactions.map((transaction) => ({
			id: transaction.id,
			title: transaction.title,
			amount: transaction.amount,
			type: transaction.type as TransactionType,
			description: transaction.description ?? undefined,
			occurredAt: transaction.occurredAt,
			userId: transaction.userId,
			createdAt: transaction.createdAt,
			updatedAt: transaction.updatedAt,
		}));
	}

	async deleteByIdAndUserId(id: string, userId: string): Promise<boolean> {
		const result = await prisma.transaction.deleteMany({
			where: {
				id,
				userId,
			},
		});

		return result.count > 0;
	}

	async updateByIdAndUserId(
		input: UpdateTransactionUseCaseInput,
	): Promise<TransactionModel | null> {
		const existingTransaction = await prisma.transaction.findFirst({
			where: {
				id: input.id,
				userId: input.userId,
			},
		});

		if (!existingTransaction) {
			return null;
		}

		const transaction = await prisma.transaction.update({
			where: {
				id: input.id,
			},
			data: {
				title: input.title,
				amount: input.amount,
				type: input.type,
				description: input.description,
				occurredAt: input.occurredAt,
			},
		});

		return {
			id: transaction.id,
			title: transaction.title,
			amount: transaction.amount,
			type: transaction.type as TransactionType,
			description: transaction.description ?? undefined,
			occurredAt: transaction.occurredAt,
			userId: transaction.userId,
			createdAt: transaction.createdAt,
			updatedAt: transaction.updatedAt,
		};
	}
}
