import type { UserModel } from "~/domain/user.model";

export interface UpdateUserUseCaseOutput {
	user: UserModel;
}
