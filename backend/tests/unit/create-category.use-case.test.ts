import { describe, expect, it, mock } from "bun:test";
import { CreateCategoryUseCase } from "~/application/use-cases/create-category/create-category.use-case";
import { CategoryNameAlreadyExistsError } from "~/application/use-cases/create-category/errors/category-name-already-exists.error";
import { InvalidCategoryNameError } from "~/application/use-cases/create-category/errors/invalid-category-name.error";
import type { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";

const makeCategory = (name: string, userId: string) => ({
	id: "cat-1",
	name,
	userId,
	createdAt: new Date(),
	updatedAt: new Date(),
});

describe("CreateCategoryUseCase", () => {
	it("should normalize name and create category", async () => {
		const create = mock(async (input: { name: string; userId: string }) =>
			makeCategory(input.name, input.userId),
		);
		const findByNameAndUserId = mock(async () => null);

		const repository = {
			create,
			findByNameAndUserId,
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateCategoryUseCase(repository);
		const result = await useCase.execute({
			name: "  Food  ",
			userId: "user-1",
		});

		expect(findByNameAndUserId).toHaveBeenCalledWith("Food", "user-1");
		expect(create).toHaveBeenCalledWith({ name: "Food", userId: "user-1" });
		expect(result.category.id).toBe("cat-1");
		expect(result.category.name).toBe("Food");
	});

	it("should throw when name is empty", async () => {
		const repository = {
			create: mock(async () => {
				throw new Error("should not create");
			}),
			findByNameAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateCategoryUseCase(repository);

		await expect(
			useCase.execute({ name: "   ", userId: "user-1" }),
		).rejects.toThrow(InvalidCategoryNameError);
	});

	it("should throw when category name already exists for the user", async () => {
		const existing = makeCategory("Food", "user-1");

		const repository = {
			create: mock(async () => {
				throw new Error("should not create");
			}),
			findByNameAndUserId: mock(async () => existing),
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateCategoryUseCase(repository);

		await expect(
			useCase.execute({ name: "Food", userId: "user-1" }),
		).rejects.toThrow(CategoryNameAlreadyExistsError);
	});

	it("should allow same name for different users", async () => {
		const create = mock(async (input: { name: string; userId: string }) =>
			makeCategory(input.name, input.userId),
		);
		const findByNameAndUserId = mock(async () => null);

		const repository = {
			create,
			findByNameAndUserId,
		} as unknown as PrismaCategoryRepository;

		const useCase = new CreateCategoryUseCase(repository);
		const result = await useCase.execute({
			name: "Food",
			userId: "user-2",
		});

		expect(result.category.userId).toBe("user-2");
	});
});
