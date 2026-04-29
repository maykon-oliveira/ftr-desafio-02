import { describe, expect, it, mock } from "bun:test";
import { LoginUserUseCase } from "~/application/use-cases/login-user/login-user.use-case";
import { InvalidCredentialsError } from "~/application/use-cases/login-user/errors/invalid-credentials.error";
import type { PrismaUserRepository } from "~/application/ports/prisma-user.repository";
import type { BcryptPasswordHasher } from "~/application/ports/bcrypt-password-hasher";

Bun.env.JWT_SECRET = Bun.env.JWT_SECRET ?? "test-secret";

describe("LoginUserUseCase", () => {
	it("should login successfully with valid credentials", async () => {
		const user = {
			id: "user-1",
			name: "John",
			email: "john@email.com",
			password: "hashed-password",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const findByEmail = mock(async () => user);
		const compare = mock(async () => true);

		const userRepository = {
			findByEmail,
		} as unknown as PrismaUserRepository;
		const passwordHasher = {
			compare,
		} as unknown as BcryptPasswordHasher;

		const useCase = new LoginUserUseCase(userRepository, passwordHasher);
		const result = await useCase.execute({
			email: "  JOHN@EMAIL.COM ",
			password: "123456",
		});

		expect(findByEmail).toHaveBeenCalledWith("john@email.com");
		expect(compare).toHaveBeenCalledWith("123456", "hashed-password");
		expect(result.user.id).toBe("user-1");
		expect(result.token.length).toBeGreaterThan(0);
	});

	it("should throw when user does not exist", async () => {
		const userRepository = {
			findByEmail: mock(async () => null),
		} as unknown as PrismaUserRepository;
		const passwordHasher = {
			compare: mock(async () => true),
		} as unknown as BcryptPasswordHasher;

		const useCase = new LoginUserUseCase(userRepository, passwordHasher);

		await expect(
			useCase.execute({ email: "notfound@email.com", password: "123456" }),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should throw when password is invalid", async () => {
		const userRepository = {
			findByEmail: mock(async () => ({
				id: "user-1",
				name: "John",
				email: "john@email.com",
				password: "hashed-password",
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		} as unknown as PrismaUserRepository;
		const passwordHasher = {
			compare: mock(async () => false),
		} as unknown as BcryptPasswordHasher;

		const useCase = new LoginUserUseCase(userRepository, passwordHasher);

		await expect(
			useCase.execute({ email: "john@email.com", password: "wrong" }),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
