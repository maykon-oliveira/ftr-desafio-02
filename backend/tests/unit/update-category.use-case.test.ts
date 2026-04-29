import { describe, expect, it, mock } from "bun:test";
import { UpdateCategoryUseCase } from "~/application/use-cases/update-category/update-category.use-case";
import { CategoryNameAlreadyInUseError } from "~/application/use-cases/update-category/errors/category-name-already-in-use.error";
import { CategoryNotFoundError } from "~/application/use-cases/update-category/errors/category-not-found.error";
import { InvalidUpdateCategoryNameError } from "~/application/use-cases/update-category/errors/invalid-update-category-name.error";
import type { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";

const makeCategory = (id: string, name: string, userId: string) => ({
	id,
	name,
	userId,
	createdAt: new Date(),
	updatedAt: new Date(),
});

describe("UpdateCategoryUseCase", () => {
	it("should normalize name and update category", async () => {
		const updated = makeCategory("cat-1", "Health", "user-1");

		const findByNameAndUserId = mock(async () => null);
		const updateByIdAndUserId = mock(async () => updated);

		const repository = {
			findByNameAndUserId,
			updateByIdAndUserId,
		} as unknown as PrismaCategoryRepository;

		const useCase = new UpdateCategoryUseCase(repository);
		const result = await useCase.execute({
			id: "cat-1",
			userId: "user-1",
			name: "  Health  ",
		});

		expect(findByNameAndUserId).toHaveBeenCalledWith("Health", "user-1");
		expect(updateByIdAndUserId).toHaveBeenCalledWith({
			id: "cat-1",
			userId: "user-1",
			name: "Health",
		});
		expect(result.category.name).toBe("Health");
	});

	it("should throw when name is provided but empty", async () => {
		const repository = {
			findByNameAndUserId: mock(async () => null),
			updateByIdAndUserId: mock(async () => {
				throw new Error("should not update");
			}),
		} as unknown as PrismaCategoryRepository;

		const useCase = new UpdateCategoryUseCase(repository);

		await expect(
			useCase.execute({ id: "cat-1", userId: "user-1", name: "   " }),
		).rejects.toThrow(InvalidUpdateCategoryNameError);
	});

	it("should throw when name is already in use by another category", async () => {
		const existing = makeCategory("cat-2", "Food", "user-1");

		const repository = {
			findByNameAndUserId: mock(async () => existing),
			updateByIdAndUserId: mock(async () => {
				throw new Error("should not update");
			}),
		} as unknown as PrismaCategoryRepository;

		const useCase = new UpdateCategoryUseCase(repository);

		await expect(
			useCase.execute({ id: "cat-1", userId: "user-1", name: "Food" }),
		).rejects.toThrow(CategoryNameAlreadyInUseError);
	});

	it("should not throw duplicate error when name belongs to same category", async () => {
		const same = makeCategory("cat-1", "Food", "user-1");

		const updateByIdAndUserId = mock(async () => same);

		const repository = {
			findByNameAndUserId: mock(async () => same),
			updateByIdAndUserId,
		} as unknown as PrismaCategoryRepository;

		const useCase = new UpdateCategoryUseCase(repository);
		const result = await useCase.execute({
			id: "cat-1",
			userId: "user-1",
			name: "Food",
		});

		expect(result.category.id).toBe("cat-1");
	});

	it("should throw when category is not found", async () => {
		const repository = {
			findByNameAndUserId: mock(async () => null),
			updateByIdAndUserId: mock(async () => null),
		} as unknown as PrismaCategoryRepository;

		const useCase = new UpdateCategoryUseCase(repository);

		await expect(
			useCase.execute({ id: "cat-999", userId: "user-1", name: "New Name" }),
		).rejects.toThrow(CategoryNotFoundError);
	});
});
