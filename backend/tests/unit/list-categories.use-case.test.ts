import { describe, expect, it, mock } from "bun:test";
import { ListCategoriesUseCase } from "~/application/use-cases/list-categories/list-categories.use-case";
import type { PrismaCategoryRepository } from "~/application/ports/prisma-category.repository";

const makeCategory = (id: string, name: string, userId: string) => ({
	id,
	name,
	userId,
	createdAt: new Date(),
	updatedAt: new Date(),
});

describe("ListCategoriesUseCase", () => {
	it("should return categories for the user", async () => {
		const categories = [
			makeCategory("cat-1", "Food", "user-1"),
			makeCategory("cat-2", "Transport", "user-1"),
		];

		const findManyByUserId = mock(async () => categories);

		const repository = {
			findManyByUserId,
		} as unknown as PrismaCategoryRepository;

		const useCase = new ListCategoriesUseCase(repository);
		const result = await useCase.execute({ userId: "user-1" });

		expect(findManyByUserId).toHaveBeenCalledWith("user-1");
		expect(result.categories).toHaveLength(2);
		expect(result.categories[0].name).toBe("Food");
		expect(result.categories[1].name).toBe("Transport");
	});

	it("should return empty list when user has no categories", async () => {
		const repository = {
			findManyByUserId: mock(async () => []),
		} as unknown as PrismaCategoryRepository;

		const useCase = new ListCategoriesUseCase(repository);
		const result = await useCase.execute({ userId: "user-1" });

		expect(result.categories).toHaveLength(0);
	});
});
