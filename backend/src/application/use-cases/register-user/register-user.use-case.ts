import type { RegisterUserUseCaseInput } from "~/application/dtos/register-user.use-case.input";
import { EmailAlreadyInUseError } from "./errors/email-already-in-use.error";
import type { RegisterUserUseCaseOutput } from "~/application/dtos/register-user.use-case.output";
import { PrismaUserRepository } from "~/application/ports/prisma-user.repository";
import { BcryptPasswordHasher } from "~/application/ports/bcrypt-password-hasher";
import { signJwt } from "~/infra/security/jwt";
import { Service } from "typedi";

@Service()
export class RegisterUserUseCase {
	constructor(
		private readonly userRepository: PrismaUserRepository,
		private readonly passwordHasher: BcryptPasswordHasher,
	) {}

	async execute(
		input: RegisterUserUseCaseInput,
	): Promise<RegisterUserUseCaseOutput> {
		const normalizedEmail = input.email.trim().toLowerCase();

		const existingUser = await this.userRepository.findByEmail(normalizedEmail);

		if (existingUser) {
			throw new EmailAlreadyInUseError();
		}

		const hashedPassword = await this.passwordHasher.hash(input.password);

		const user = await this.userRepository.create({
			name: input.name.trim(),
			email: normalizedEmail,
			password: hashedPassword,
		});

		return {
			token: signJwt({ id: user.id, email: user.email }),
			refreshToken: signJwt({ id: user.id, email: user.email }, "1d"),
			user,
		};
	}
}
