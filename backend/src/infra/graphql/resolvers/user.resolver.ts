import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { UserModel } from "~/domain/user.model";
import { GetUserByIdUseCase } from "~/application/use-cases/get-user-by-id/get-user-by-id.use-case";
import { isAuth } from "../middleware/auth.middleware";

@Service()
@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

  @Query(() => UserModel)
  @UseMiddleware(isAuth)
  async getUser(
    @Arg("id", () => String) id: string,
  ): Promise<UserModel> {
    return this.getUserByIdUseCase.execute(id);
  }
}