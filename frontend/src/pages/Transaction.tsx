import { Icon } from "@/components/icon/Icon";
import type { IconType } from "@/components/icon/type";
import { NewTransactionModal } from "@/components/NewTransactionModal";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { colorsVariant, type ColorsType } from "@/lib/colors";
import { TransactionTypeLabel } from "@/lib/transaction-type";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/store/transaction";
import type { Transaction } from "@/types";
import { formatDate } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Transaction() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<Transaction | undefined>()
	const { transactions, fetchTransactions } = useTransactionStore()

	useEffect(() => {
		fetchTransactions().catch(() => {
			toast.error("Erro ao carregar categorias")
		})
	}, [fetchTransactions])

	const handleCreateNew = () => {
		setSelectedCategory(undefined)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedCategory(undefined)
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
			transaction={selectedCategory}
			onSuccess={() => { }}
		/>

		<Card>
			<Table>
				<TableHeader>
					<TableRow className="uppercase">
						<TableHead>Descrição</TableHead>
						<TableHead>Data</TableHead>
						<TableHead>Categoria</TableHead>
						<TableHead>Tipo</TableHead>
						<TableHead>Valor</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map(transaction => {
						const category = transaction.category;
						const color = colorsVariant[category.color as ColorsType];

						return (
							<TableRow key={transaction.id}>
								<TableCell className="flex items-center gap-2">
									<div className={cn(buttonVariants({ size: "icon-lg" }), color.light, color.text)}>
										<Icon iconName={category.icon as IconType} />
									</div>
									{transaction.description}
								</TableCell>
								<TableCell>{formatDate(transaction.occurredAt, "dd/MM/yyyy")}</TableCell>
								<TableCell>
									<Badge className={cn(color.light, color.text)}>
										{category.name}
									</Badge>
								</TableCell>
								<TableCell>{TransactionTypeLabel[transaction.type]}</TableCell>
								<TableCell>{transaction.amount}</TableCell>
								<TableCell>-</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</Card>
	</div>
}