import type { CreateTransactionUseCaseInput } from "~/application/dtos/create-transaction.use-case.input";
import type { UpdateTransactionUseCaseInput } from "~/application/dtos/update-transaction.use-case.input";
import type {
	TransactionModel,
	TransactionType,
} from "~/domain/transaction.model";
import { prisma } from "~/infra/db/prisma";
import { Service } from "typedi";

@Service()
export class PrismaTransactionRepository {
	async create(
		input: CreateTransactionUseCaseInput,
	): Promise<TransactionModel> {
		const transaction = await prisma.transaction.create({
			data: {
				description: input.description,
				amount: input.amount,
				type: input.type,
				occurredAt: input.occurredAt,
				categoryId: input.categoryId,
				userId: input.userId,
			},
			select: {
				id: true,
				description: true,
				amount: true,
				type: true,
				occurredAt: true,
				userId: true,
				categoryId: true,
				createdAt: true,
				updatedAt: true,
			}
		});

		return {
			id: transaction.id,
			description: transaction.description,
			amount: transaction.amount,
			type: transaction.type as TransactionType,
			occurredAt: transaction.occurredAt,
			userId: transaction.userId,
			categoryId: transaction.categoryId,
			createdAt: transaction.createdAt,
			updatedAt: transaction.updatedAt,
		} as TransactionModel;
	}

	async findManyByUserId(userId: string): Promise<TransactionModel[]> {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
			},
			orderBy: {
				occurredAt: "desc",
			},
			select: {
				id: true,
				description: true,
				amount: true,
				type: true,
				occurredAt: true,
				userId: true,
				categoryId: true,
				createdAt: true,
				updatedAt: true,
			}
		});

		return transactions.map((transaction) => ({
			id: transaction.id,
			description: transaction.description,
			amount: transaction.amount,
			type: transaction.type as TransactionType,
			occurredAt: transaction.occurredAt,
			userId: transaction.userId,
			categoryId: transaction.categoryId,
			createdAt: transaction.createdAt,
			updatedAt: transaction.updatedAt,
		})) as TransactionModel[];
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
				description: input.description,
				amount: input.amount,
				type: input.type,
				occurredAt: input.occurredAt,
				categoryId: input.categoryId,
			},
			select: {
				id: true,
				description: true,
				amount: true,
				type: true,
				occurredAt: true,
				userId: true,
				categoryId: true,
				createdAt: true,
				updatedAt: true,
			}
		});

		return {
			id: transaction.id,
			description: transaction.description,
			amount: transaction.amount,
			type: transaction.type as TransactionType,
			occurredAt: transaction.occurredAt,
			userId: transaction.userId,
			categoryId: transaction.categoryId,
			createdAt: transaction.createdAt,
			updatedAt: transaction.updatedAt,
		} as TransactionModel;
	}
}
