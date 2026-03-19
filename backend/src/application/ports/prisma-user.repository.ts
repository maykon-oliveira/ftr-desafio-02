import type { UserModel } from "~/domain/user.model";
import { prisma } from "~/infra/db/prisma";
import type { RegisterUserUseCaseInput } from "../dtos/register-user.use-case.input";
import { Service } from "typedi";

@Service()
export class PrismaUserRepository {
	async findById(id: string): Promise<UserModel | null> {
		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	async findByEmail(email: string): Promise<UserModel | null> {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	async create(input: RegisterUserUseCaseInput): Promise<UserModel> {
		const user = await prisma.user.create({
			data: {
				name: input.name,
				email: input.email,
				password: input.password,
			},
		});

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
