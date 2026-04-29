import { describe, expect, it, mock } from "bun:test";
import { GetUserByIdUseCase } from "~/application/use-cases/get-user-by-id/get-user-by-id.use-case";
import { UserNotFoundError } from "~/application/use-cases/get-user-by-id/errors/user-not-found.error";
import type { PrismaUserRepository } from "~/application/ports/prisma-user.repository";

describe("GetUserByIdUseCase", () => {
	it("should return user when found", async () => {
		const user = {
			id: "user-1",
			name: "John",
			email: "john@email.com",
			password: "hashed-password",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const userRepository = {
			findById: mock(async () => user),
		} as unknown as PrismaUserRepository;

		const useCase = new GetUserByIdUseCase(userRepository);
		const result = await useCase.execute("user-1");

		expect(result).toEqual(user);
	});

	it("should throw when user does not exist", async () => {
		const userRepository = {
			findById: mock(async () => null),
		} as unknown as PrismaUserRepository;

		const useCase = new GetUserByIdUseCase(userRepository);

		await expect(useCase.execute("missing-user")).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
