import { cn } from "@/lib/utils"
import { Card, CardAction, CardHeader, CardTitle } from "./ui/card"
import { buttonVariants } from "./ui/button"
import { Icon } from "./icon/Icon"
import type { IconType } from "./icon/type"
import { colorsVariant, type ColorsType } from "@/lib/colors"
import { Table, TableBody, TableCell, TableRow } from "./ui/table"
import { NavLink } from "react-router-dom"
import { useDashboardStore } from "@/store/dashboard"

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function CategoryTotalTable() {
	const data = useDashboardStore(store => store.data?.categoryTotals || [])
	return (
		<Card>
			<CardHeader>
				<CardTitle className="uppercase text-gray-500">Categorias</CardTitle>
				<CardAction>
					<NavLink
						to={"/categories"} className="text-brand-base flex gap-2 items-center">
						Gerenciar
						<Icon iconName="arrowRight" />
					</NavLink>
				</CardAction>
			</CardHeader>
			{data.length === 0 ? (
				<p className="text-sm text-muted-foreground py-4 text-center">
					Nenhuma categoria com movimentação.
				</p>
			) : (
				<Table className="border-t">
					<TableBody>
						{data.map(({ categoryId, categoryName, icon, color, total, transactionsCount }) => {
							const variant = colorsVariant[color as ColorsType]
							return (
								<TableRow key={categoryId}>
									<TableCell className="flex items-center gap-3 min-w-0 text-left">
										<div className={cn(
											buttonVariants({ size: "icon" }),
											variant.light,
											variant.text,
											"shrink-0"
										)}>
											<Icon iconName={icon as IconType} />
										</div>
										<span className="font-medium text-gray-800 truncate">{categoryName}</span>
									</TableCell>
									<TableCell className="text-gray-500 text-right">
										{(transactionsCount ?? 0) === 1
											? "1 item"
											: `${transactionsCount ?? 0} itens`}
									</TableCell>
									<TableCell className={cn(
										"font-semibold text-sm shrink-0 text-right",
									)}>
										{formatter.format(total)}
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			)}
		</Card>
	)
}