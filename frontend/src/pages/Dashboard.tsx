import { useEffect } from "react"
import { toast } from "sonner"
import { useDashboardStore } from "@/store/dashboard"
import { Icon } from "@/components/icon/Icon"
import { Stat, StatIndicator, StatLabel, StatValue } from "@/components/ui/stat"
import { cn } from "@/lib/utils"
import { colorsVariant } from "@/lib/colors"
import { CategoryTotalTable } from "@/components/CategoryTotalTable"
import { LastTransactionTable } from "@/components/LastTransactionTable"

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function Dashboard() {
	const { data, isLoading, fetchDashboard } = useDashboardStore()

	useEffect(() => {
		fetchDashboard().catch(() => {
			toast.error("Erro ao carregar dashboard")
		})
	}, [fetchDashboard])

	const variant = colorsVariant["purple"]

	return (
		<div className="space-y-6">
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">Carregando dashboard...</p>
				</div>
			) : data ? (
				<>
					{/* Stat Cards */}
					<div className="grid gap-4 sm:grid-cols-3">
						<Stat>
							<StatLabel className="uppercase">Saldo total</StatLabel>
							<StatIndicator variant="icon" className={cn([variant.light, variant.text])}>
								<Icon iconName="wallet" />
							</StatIndicator>
							<StatValue>
								{formatter.format(data.totalBalance)}
							</StatValue>
						</Stat>

						<Stat>
							<StatLabel className="uppercase">Receitas do mês</StatLabel>
							<StatIndicator variant="icon" color="success">
								<Icon iconName="arrowUp" />
							</StatIndicator>
							<StatValue>
								{formatter.format(data.monthlyIncome)}
							</StatValue>
						</Stat>

						<Stat>
							<StatLabel className="uppercase">Despesas do mês</StatLabel>
							<StatIndicator variant="icon" color="error">
								<Icon iconName="arrowDown" />
							</StatIndicator>
							<StatValue>
								{formatter.format(Math.abs(data.monthlyExpense))}
							</StatValue>
						</Stat>
					</div>

					<div className="grid gap-6 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<LastTransactionTable />
						</div>

						<CategoryTotalTable />
					</div>
				</>
			) : (
				<div className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">Nenhum dado disponível.</p>
				</div>
			)}
		</div>
	)
}
