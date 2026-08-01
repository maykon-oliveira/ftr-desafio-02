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

	async findManyByUserId(
		userId: string,
		filters?: {
			description?: string;
			type?: string;
			categoryId?: string;
			month?: number;
			year?: number;
			page?: number;
			pageSize?: number;
		},
	): Promise<TransactionModel[]> {
		const where: Record<string, unknown> = { userId };

		if (filters?.description) {
			where.description = { contains: filters.description };
		}

		if (filters?.type) {
			where.type = filters.type;
		}

		if (filters?.categoryId) {
			where.categoryId = filters.categoryId;
		}

		if (filters?.month !== undefined && filters?.year !== undefined) {
			const startDate = new Date(filters.year, filters.month - 1, 1);
			const endDate = new Date(filters.year, filters.month, 1);
			where.occurredAt = {
				gte: startDate,
				lt: endDate,
			};
		}

		const page = filters?.page ?? 1;
		const pageSize = filters?.pageSize ?? 10;
		const skip = (page - 1) * pageSize;

		const transactions = await prisma.transaction.findMany({
			where,
			orderBy: {
				occurredAt: "desc",
			},
			skip,
			take: pageSize,
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

	async countByUserId(
		userId: string,
		filters?: {
			description?: string;
			type?: string;
			categoryId?: string;
			month?: number;
			year?: number;
		},
	): Promise<number> {
		const where: Record<string, unknown> = { userId };

		if (filters?.description) {
			where.description = { contains: filters.description };
		}

		if (filters?.type) {
			where.type = filters.type;
		}

		if (filters?.categoryId) {
			where.categoryId = filters.categoryId;
		}

		if (filters?.month !== undefined && filters?.year !== undefined) {
			const startDate = new Date(filters.year, filters.month - 1, 1);
			const endDate = new Date(filters.year, filters.month, 1);
			where.occurredAt = {
				gte: startDate,
				lt: endDate,
			};
		}

		return prisma.transaction.count({ where });
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

	async aggregateBalance(userId: string): Promise<number> {
		const grouped = await prisma.transaction.groupBy({
			by: ["type"],
			where: { userId },
			_sum: { amount: true },
		});

		const income = grouped.find((g) => g.type === "INCOME")?._sum.amount ?? 0;
		const expense = grouped.find((g) => g.type === "EXPENSE")?._sum.amount ?? 0;

		return income + expense; // expense is already negative
	}

	async aggregateByType(
		userId: string,
		type: string,
		month: number,
		year: number,
	): Promise<number> {
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 1);

		const result = await prisma.transaction.aggregate({
			where: {
				userId,
				type: type as TransactionType | any,
				occurredAt: { gte: startDate, lt: endDate },
			},
			_sum: { amount: true },
		});

		return result._sum.amount ?? 0;
	}

	async aggregateByCategory(
		userId: string,
	): Promise<Array<{ categoryId: string; total: number }>> {
		const grouped = await prisma.transaction.groupBy({
			by: ["categoryId"],
			where: { userId },
			_sum: { amount: true },
		});

		return grouped.map((g) => ({
			categoryId: g.categoryId,
			total: g._sum.amount ?? 0,
		}));
	}

	async findLastByUserId(
		userId: string,
		limit: number,
	): Promise<TransactionModel[]> {
		const transactions = await prisma.transaction.findMany({
			where: { userId },
			orderBy: { occurredAt: "desc" },
			take: limit,
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
			},
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
}
