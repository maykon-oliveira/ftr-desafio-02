import { Service } from "typedi";
import type { CreateCategoryUseCaseInput } from "~/application/dtos/create-category.use-case.input";
import type { CategoryModel } from "~/domain/category.model";
import { prisma } from "~/infra/db/prisma";

@Service()
export class PrismaCategoryRepository {
	async create(input: CreateCategoryUseCaseInput): Promise<CategoryModel> {
		const category = await prisma.category.create({
			data: {
				name: input.name,
				userId: input.userId,
			},
		});

		return {
			id: category.id,
			name: category.name,
			userId: category.userId,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		};
	}

	async findByNameAndUserId(
		name: string,
		userId: string,
	): Promise<CategoryModel | null> {
		const category = await prisma.category.findUnique({
			where: {
				name_userId: { name, userId },
			},
		});

		if (!category) return null;

		return {
			id: category.id,
			name: category.name,
			userId: category.userId,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		};
	}

	async findManyByUserId(userId: string): Promise<CategoryModel[]> {
		const categories = await prisma.category.findMany({
			where: { userId },
			orderBy: { name: "asc" },
		});

		return categories.map((category) => ({
			id: category.id,
			name: category.name,
			userId: category.userId,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		}));
	}
}
