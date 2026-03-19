import { UserModel } from "~/domain/user.model";

export interface RegisterUserUseCaseOutput {
	token: string;
	refreshToken: string;
	user: UserModel;
}
