import type { CreateTransactionUseCaseInput } from "~/application/dtos/create-transaction.use-case.input";
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
}
