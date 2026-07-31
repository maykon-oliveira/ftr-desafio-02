import { cn } from "@/lib/utils"
import { Card, CardAction, CardHeader, CardTitle } from "./ui/card"
import { Button, buttonVariants } from "./ui/button"
import { Icon } from "./icon/Icon"
import type { IconType } from "./icon/type"
import { colorsVariant, type ColorsType } from "@/lib/colors"
import { Table, TableBody, TableCell, TableFooter, TableRow } from "./ui/table"
import { transactionTypesOptions } from "@/lib/transaction-type"
import { formatDate } from "date-fns"
import { Badge } from "./ui/badge"
import { NavLink } from "react-router-dom"
import { NewTransactionModal } from "./NewTransactionModal"
import { useState } from "react"
import { useDashboardStore } from "@/store/dashboard"

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function LastTransactionTable() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const fetchDashboard = useDashboardStore(store => store.fetchDashboard)
	const data = useDashboardStore(store => store.data?.lastTransactions || [])

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const handleCreateNew = () => {
		setIsModalOpen(true)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="uppercase text-gray-500">Transações recentes</CardTitle>
				<CardAction>
					<NavLink
						to={"/transactions"} className="text-brand-base flex gap-2 items-center">
						Ver todas
						<Icon iconName="arrowRight" />
					</NavLink>
				</CardAction>
			</CardHeader>
			{data.length === 0 ? (
				<p className="text-sm text-muted-foreground py-4 text-center">
					Nenhuma transação recente.
				</p>
			) : (
				<Table className="border-t">
					<TableBody>
						{data.map((transaction) => {
							const category = transaction.category
							const color = colorsVariant[category.color as ColorsType]
							const typeOption = transaction.type === "EXPENSE"
								? transactionTypesOptions[0]
								: transactionTypesOptions[1]

							return (
								<TableRow key={transaction.id}>
									<TableCell>
										<div className="flex items-center gap-2">
											<div className={cn(
												buttonVariants({ size: "icon-sm" }),
												color.light,
												color.text,
												"shrink-0"
											)}>
												<Icon iconName={category.icon as IconType} />
											</div>
											<div className="flex flex-col space-y-1">
												<span className="font-medium text-gray-800 truncate">
													{transaction.description}
												</span>
												<span className="text-center text-gray-500 text-xs">
													{formatDate(transaction.occurredAt, "dd/MM/yyyy")}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="text-center">
										<Badge className={cn(color.light, color.text)}>
											{category.name}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className={cn(
											"flex items-center justify-end gap-2 font-semibold",
										)}>
											<span>
												{formatter.format(transaction.amount)}
											</span>
											<span className={cn(
												"text-sm",
												transaction.type === "EXPENSE" ? "text-red-base" : "text-green-base"
											)}>
												{typeOption.icon}
											</span>
										</div>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
					<TableFooter className="bg-white">
						<TableRow className="hover:bg-white">
							<TableCell colSpan={3} className="text-center">
								<Button variant="ghost" className="text-brand-base hover:text-brand-dark" onClick={handleCreateNew}>
									<Icon iconName="plus" />
									Nova transação
								</Button>
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			)}
			<NewTransactionModal
				isOpen={isModalOpen}
				onOpenChange={handleCloseModal}
				onSuccess={() => fetchDashboard()}
			/>
		</Card>
	)
}