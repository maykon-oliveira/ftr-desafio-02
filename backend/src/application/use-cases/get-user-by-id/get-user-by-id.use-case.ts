import { Service } from "typedi";
import type { UserModel } from "~/domain/user.model";
import { PrismaUserRepository } from "~/application/ports/prisma-user.repository";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Service()
export class GetUserByIdUseCase {
	constructor(private readonly userRepository: PrismaUserRepository) {}

	async execute(id: string): Promise<UserModel> {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new UserNotFoundError();
		}

		return user;
	}
}
