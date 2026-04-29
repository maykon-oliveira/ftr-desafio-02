import type { UserModel } from "~/infra/db/generated/internal/prismaNamespaceBrowser";

export interface LoginUserUseCaseOutput {
	token: string;
	refreshToken: string;
	user: UserModel;
}
