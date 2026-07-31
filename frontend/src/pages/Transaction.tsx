import { Icon } from "@/components/icon/Icon";
import type { IconType } from "@/components/icon/type";
import { NewTransactionModal } from "@/components/NewTransactionModal";
import { TransactionFilter } from "@/components/TransactionFilter";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { colorsVariant, type ColorsType } from "@/lib/colors";
import { transactionTypesOptions } from "@/lib/transaction-type";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/store/transaction";
import type { Transaction } from "@/types";
import type { TransactionFilters } from "@/api/query/ListTransactions";
import { formatDate } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function Transaction() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>()
	const [filters, setFilters] = useState<TransactionFilters>({})
	const { transactions, isLoading, fetchTransactions, deleteTransaction } = useTransactionStore()

	const loadTransactions = useCallback(() => {
		// Only include non-empty values in the filter
		const cleanedFilters: TransactionFilters = {}
		if (filters.description) cleanedFilters.description = filters.description
		if (filters.type) cleanedFilters.type = filters.type
		if (filters.categoryId) cleanedFilters.categoryId = filters.categoryId
		if (filters.month !== undefined && filters.year !== undefined) {
			cleanedFilters.month = filters.month
			cleanedFilters.year = filters.year
		}

		fetchTransactions(Object.keys(cleanedFilters).length > 0 ? cleanedFilters : undefined).catch(() => {
			toast.error("Erro ao carregar transações")
		})
	}, [fetchTransactions, filters])

	useEffect(() => {
		loadTransactions()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	// Debounced refetch when filters change
	useEffect(() => {
		const timer = setTimeout(() => {
			loadTransactions()
		}, 300)
		return () => clearTimeout(timer)
	}, [filters, loadTransactions])

	const handleCreateNew = () => {
		setSelectedTransaction(undefined)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedTransaction(undefined)
	}

	const handleEdit = (transaction: Transaction) => {
		setSelectedTransaction(transaction)
		setIsModalOpen(true)
	}

	const handleDelete = async (id: string) => {
		try {
			await deleteTransaction(id)
			toast.success("Transação removida com sucesso!")
		} catch {
			toast.error("Erro ao remover transação")
		}
	}

	return <div className="space-y-6">
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold">Transações</h1>
				<p className="text-sm text-muted-foreground">Gerencie todas as suas transações financeiras</p>
			</div>
			<Button onClick={handleCreateNew}>
				<Icon iconName="plus" />
				Nova transação
			</Button>
		</div>

		<NewTransactionModal
			isOpen={isModalOpen}
			onOpenChange={handleCloseModal}
			transaction={selectedTransaction}
			onSuccess={() => { }}
		/>

		<TransactionFilter filters={filters} onFiltersChange={setFilters} />

		<Table className="bg-white rounded-md">
			<TableHeader>
				<TableRow className="uppercase hover:bg-white">
					<TableHead className="text-gray-500">Descrição</TableHead>
					<TableHead className="text-gray-500 text-center">Data</TableHead>
					<TableHead className="text-gray-500 text-center">Categoria</TableHead>
					<TableHead className="text-gray-500 text-center">Tipo</TableHead>
					<TableHead className="text-gray-500 text-right">Valor</TableHead>
					<TableHead className="text-gray-500 text-right">Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transactions.map(transaction => {
					const category = transaction.category;
					const color = colorsVariant[category.color as ColorsType];
					const transactionType = transaction.type === 'EXPENSE' ? transactionTypesOptions[0] : transactionTypesOptions[1]

					return (
						<TableRow className="hover:bg-white" key={transaction.id}>
							<TableCell className="flex items-center gap-2">
								<div className={cn(buttonVariants({ size: "icon-lg" }), color.light, color.text)}>
									<Icon iconName={category.icon as IconType} />
								</div>
								<span className="text-gray-800 font-medium">{transaction.description}</span>
							</TableCell>
							<TableCell className="text-center text-gray-500">{formatDate(transaction.occurredAt, "dd/MM/yyyy")}</TableCell>
							<TableCell className="text-center">
								<Badge className={cn(color.light, color.text)}>
									{category.name}
								</Badge>
							</TableCell>
							<TableCell className="flex justify-center">
								<div className={cn(
									transaction.type === 'EXPENSE' ? "text-red-base" : "text-green-base",
									"flex gap-2 items-center"
								)}>
									{transactionType.icon}
									{transactionType.label}
								</div>
							</TableCell>
							<TableCell className="text-right font-semibold text-gray-800">{formatter.format(transaction.amount)}</TableCell>
							<TableCell>
								<div className="flex gap-2 justify-end">
									<Button
										size="icon"
										variant="outline"
										onClick={() => handleDelete(transaction.id)}
										disabled={isLoading}
									>
										<Icon iconName="trash" className="text-destructive" />
									</Button>
									<Button
										size="icon"
										variant="outline"
										onClick={() => handleEdit(transaction)}
									>
										<Icon iconName="squarePen" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	</div>
}