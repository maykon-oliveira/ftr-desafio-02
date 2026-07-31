import type { UpdateUserUseCaseInput } from "~/application/dtos/update-user.use-case.input";
import type { UpdateUserUseCaseOutput } from "~/application/dtos/update-user.use-case.output";
import { PrismaUserRepository } from "~/application/ports/prisma-user.repository";
import { Service } from "typedi";

@Service()
export class UpdateUserUseCase {
	constructor(
		private readonly userRepository: PrismaUserRepository,
	) {}

	async execute(
		input: UpdateUserUseCaseInput,
	): Promise<UpdateUserUseCaseOutput> {
		const currentUser = await this.userRepository.findById(input.id);

		if (!currentUser) {
			throw new Error("Usuário não encontrado");
		}

		const user = await this.userRepository.update(input);

		return { user };
	}
}
