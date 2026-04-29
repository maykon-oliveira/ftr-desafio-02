import { describe, expect, it, mock } from "bun:test";
import { RegisterUserUseCase } from "~/application/use-cases/register-user/register-user.use-case";
import { EmailAlreadyInUseError } from "~/application/use-cases/register-user/errors/email-already-in-use.error";
import type { PrismaUserRepository } from "~/application/ports/prisma-user.repository";
import type { BcryptPasswordHasher } from "~/application/ports/bcrypt-password-hasher";

Bun.env.JWT_SECRET = Bun.env.JWT_SECRET ?? "test-secret";

describe("RegisterUserUseCase", () => {
	it("should normalize email and create user", async () => {
		const findByEmail = mock(async () => null);
		const create = mock(
			async (input: { name: string; email: string; password: string }) => ({
				id: "user-1",
				name: input.name,
				email: input.email,
				password: input.password,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);
		const hash = mock(async () => "hashed-password");

		const userRepository = {
			findByEmail,
			create,
		} as unknown as PrismaUserRepository;
		const passwordHasher = {
			hash,
		} as unknown as BcryptPasswordHasher;

		const useCase = new RegisterUserUseCase(userRepository, passwordHasher);

		const result = await useCase.execute({
			name: "John Doe",
			email: " John@Email.COM ",
			password: "123456",
		});

		expect(findByEmail).toHaveBeenCalledWith("john@email.com");
		expect(hash).toHaveBeenCalledWith("123456");
		expect(create).toHaveBeenCalledWith({
			name: "John Doe",
			email: "john@email.com",
			password: "hashed-password",
		});
		expect(result.token.length).toBeGreaterThan(0);
		expect(result.refreshToken.length).toBeGreaterThan(0);
		expect(result.user.email).toBe("john@email.com");
	});

	it("should throw when email already exists", async () => {
		const findByEmail = mock(async () => ({
			id: "user-1",
			name: "Jane",
			email: "jane@email.com",
			password: "hashed",
			createdAt: new Date(),
			updatedAt: new Date(),
		}));
		const userRepository = {
			findByEmail,
			create: mock(async () => {
				throw new Error("should not create");
			}),
		} as unknown as PrismaUserRepository;
		const passwordHasher = {
			hash: mock(async () => "hashed"),
		} as unknown as BcryptPasswordHasher;

		const useCase = new RegisterUserUseCase(userRepository, passwordHasher);

		await expect(
			useCase.execute({
				name: "Jane",
				email: "jane@email.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(EmailAlreadyInUseError);
	});
});
