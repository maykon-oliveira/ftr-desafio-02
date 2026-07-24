import { Service } from "typedi";
import type { CreateCategoryUseCaseInput } from "~/application/dtos/create-category.use-case.input";
import type { UpdateCategoryUseCaseInput } from "~/application/dtos/update-category.use-case.input";
import type { CategoryModel } from "~/domain/category.model";
import { prisma } from "~/infra/db/prisma";

@Service()
export class PrismaCategoryRepository {
	async create(input: CreateCategoryUseCaseInput): Promise<CategoryModel> {
		const category = await prisma.category.create({
			data: {
				name: input.name,
				userId: input.userId,
				description: input.description,
				icon: input.icon,
				color: input.color,
			},
		});

		return {
			id: category.id,
			name: category.name,
			userId: category.userId,
			description: category.description || undefined,
			icon: category.icon,
			color: category.color,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
			transactionsCount: 0,
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
			description: category.description || undefined,
			icon: category.icon,
			color: category.color,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
			transactionsCount: 0,
		};
	}

	async findByIdAndUserId(
		id: string,
		userId: string,
	): Promise<CategoryModel | null> {
		const category = await prisma.category.findFirst({
			where: { id, userId },
		});

		if (!category) return null;

		return {
			id: category.id,
			name: category.name,
			description: category.description || undefined,
			icon: category.icon,
			color: category.color,
			userId: category.userId,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
			transactionsCount: 0,
		};
	}

	async findManyByUserId(userId: string): Promise<CategoryModel[]> {
		const categories = await prisma.category.findMany({
			where: { userId },
			orderBy: { name: "asc" },
			include: {
				_count: {
					select: { transactions: true },
				},
			},
		});

		return categories.map((category) => ({
			id: category.id,
			name: category.name,
			description: category.description || undefined,
			icon: category.icon,
			color: category.color,
			userId: category.userId,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
			transactionsCount: category._count?.transactions ?? 0,
		}));
	}

	async updateByIdAndUserId(
		input: UpdateCategoryUseCaseInput,
	): Promise<CategoryModel | null> {
		const existing = await prisma.category.findFirst({
			where: { id: input.id, userId: input.userId },
		});

		if (!existing) return null;

		const category = await prisma.category.update({
			where: { id: input.id },
			data: {
				...(input.name !== undefined && { name: input.name }),
				...(input.description !== undefined && {
					description: input.description,
				}),
				...(input.icon !== undefined && { icon: input.icon }),
				...(input.color !== undefined && { color: input.color }),
			},
		});

		return {
			id: category.id,
			name: category.name,
			description: category.description || undefined,
			icon: category.icon,
			color: category.color,
			userId: category.userId,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
			transactionsCount: 0,
		};
	}

	async deleteByIdAndUserId(id: string, userId: string): Promise<boolean> {
		const result = await prisma.category.deleteMany({
			where: {
				id,
				userId,
			},
		});

		return result.count > 0;
	}
}
