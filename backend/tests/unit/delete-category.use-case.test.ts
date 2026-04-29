import { describe, expect, it, mock } from "bun:test";
import { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";
import { DeleteCategoryUseCase } from "~/application/use-cases/delete-category/delete-category.use-case";
import { CategoryNotFoundError } from "~/application/use-cases/delete-category/errors/category-not-found.error";

describe("DeleteCategoryUseCase", () => {
	it("should delete category successfully", async () => {
		const repository = {
			deleteByIdAndUserId: mock(async () => true),
		} as unknown as PrismaCategoryRepository;

		const useCase = new DeleteCategoryUseCase(repository);
		const result = await useCase.execute({
			id: "cat-1",
			userId: "user-1",
		});

		expect(result.success).toBe(true);
	});

	it("should throw when category does not exist", async () => {
		const repository = {
			deleteByIdAndUserId: mock(async () => false),
		} as unknown as PrismaCategoryRepository;

		const useCase = new DeleteCategoryUseCase(repository);

		await expect(
			useCase.execute({ id: "missing", userId: "user-1" }),
		).rejects.toBeInstanceOf(CategoryNotFoundError);
	});
});
