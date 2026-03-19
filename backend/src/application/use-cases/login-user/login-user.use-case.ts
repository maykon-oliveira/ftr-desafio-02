import { Service } from "typedi";
import type { LoginUserUseCaseInput } from "~/application/dtos/login-user.use-case.input";
import type { LoginUserUseCaseOutput } from "~/application/dtos/login-user.use-case.output";
import { BcryptPasswordHasher } from "~/application/ports/bcrypt-password-hasher";
import { PrismaUserRepository } from "~/application/ports/prisma-user.repository";
import { signJwt } from "~/infra/security/jwt";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";

@Service()
export class LoginUserUseCase {
	constructor(
		private readonly userRepository: PrismaUserRepository,
		private readonly passwordHasher: BcryptPasswordHasher,
	) {}

	async execute(input: LoginUserUseCaseInput): Promise<LoginUserUseCaseOutput> {
		const normalizedEmail = input.email.trim().toLowerCase();

		const user = await this.userRepository.findByEmail(normalizedEmail);

		if (!user) {
			throw new InvalidCredentialsError();
		}

		const isPasswordValid = await this.passwordHasher.compare(
			input.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new InvalidCredentialsError();
		}

		return {
			token: signJwt({ id: user.id, email: user.email }),
			refreshToken: signJwt({ id: user.id, email: user.email }, "1d"),
			user,
		};
	}
}