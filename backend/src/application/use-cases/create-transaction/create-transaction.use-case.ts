import { Service } from "typedi";
import type { CreateTransactionUseCaseInput } from "~/application/dtos/create-transaction.use-case.input";
import type { CreateTransactionUseCaseOutput } from "~/application/dtos/create-transaction.use-case.output";
import { PrismaTransactionRepository } from "~/application/ports/prisma-transaction.repository";
import { InvalidTransactionAmountError } from "./errors/invalid-transaction-amount.error";
import { InvalidTransactionTitleError } from "./errors/invalid-transaction-title.error";

@Service()
export class CreateTransactionUseCase {
	constructor(
		private readonly transactionRepository: PrismaTransactionRepository,
	) {}

	async execute(
		input: CreateTransactionUseCaseInput,
	): Promise<CreateTransactionUseCaseOutput> {
		const normalizedTitle = input.title.trim();
		const normalizedDescription = input.description?.trim();

		if (!normalizedTitle) {
			throw new InvalidTransactionTitleError();
		}

		if (input.amount <= 0) {
			throw new InvalidTransactionAmountError();
		}

		const transaction = await this.transactionRepository.create({
			...input,
			title: normalizedTitle,
			description: normalizedDescription || undefined,
		});

		return {
			transaction,
		};
	}
}
