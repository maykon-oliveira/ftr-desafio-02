import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { GetDashboardUseCase } from "~/application/use-cases/get-dashboard/get-dashboard.use-case";
import type { GraphqlContext } from "../context";
import { isAuth } from "../middleware/auth.middleware";
import { DashboardOutput } from "../outputs/dashboard.output";

@Service()
@Resolver()
export class DashboardResolver {
	constructor(
		private readonly getDashboardUseCase: GetDashboardUseCase,
	) {}

	@Query(() => DashboardOutput)
	@UseMiddleware(isAuth)
	async dashboard(
		@Ctx() context: GraphqlContext,
	): Promise<DashboardOutput> {
		return this.getDashboardUseCase.execute({ userId: context.user! });
	}
}
