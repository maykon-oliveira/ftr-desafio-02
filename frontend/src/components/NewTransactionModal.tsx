import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel } from "./ui/field"
import { useCategoryStore } from "@/store/category"
import { useTransactionStore } from "@/store/transaction"
import { toast } from "sonner"
import type { Transaction } from "@/types"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { transactionTypesOptions } from "@/lib/transaction-type"
import { formatDate } from "date-fns"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

interface NewTransactionModalProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => void
	transaction?: Transaction
}

function format(date: Date | undefined) {
	if (!date) {
		return ""
	}

	return formatDate(date, "dd/MM/yyyy")
}

export function NewTransactionModal({
	isOpen,
	onOpenChange,
	onSuccess,
	transaction,
}: NewTransactionModalProps) {
	const { categories, fetchCategories, isLoading: isLoadingCategories } = useCategoryStore()
	const categorySelectItems = categories.map(({ id, name }) => ({ value: id, label: name }));

	const { createTransaction, updateTransaction, isLoading: isLoadingTransaction, error } = useTransactionStore()

	const isEditMode = !!transaction
	const [formData, setFormData] = useState({
		description: "",
		amount: "",
		type: "EXPENSE",
		categoryId: "",
		occurredAt: new Date(),
	})
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	useEffect(() => {
		if (isOpen) {
			fetchCategories().catch(() => {
				toast.error("Erro ao carregar categorias")
			})
		}
	}, [fetchCategories, isOpen])

	useEffect(() => {
		if (transaction && isOpen) {
			setFormData({
				description: transaction.description ?? "",
				amount: transaction.amount.toString(),
				type: transaction.type,
				categoryId: transaction.category?.id ?? "",
				occurredAt: new Date(transaction.occurredAt),
			})
		} else if (isOpen && !transaction) {
			setFormData({
				description: "",
				amount: "",
				type: "EXPENSE",
				categoryId: "",
				occurredAt: new Date(),
			})
		}
	}, [transaction, isOpen])

	const isSubmitting = isLoadingTransaction || isLoadingCategories

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!formData.description.trim()) {
			toast.error("Digite um título para a transação")
			return
		}

		if (!formData.amount.trim() || Number.isNaN(Number(formData.amount))) {
			toast.error("Digite um valor válido")
			return
		}

		if (!formData.categoryId) {
			toast.error("Escolha uma categoria")
			return
		}

		if (!formData.occurredAt) {
			toast.error("Escolha uma data")
			return
		}

		try {
			if (isEditMode && transaction) {
				await updateTransaction(transaction.id, {
					description: formData.description.trim(),
					amount: Number(formData.amount),
					type: formData.type as "EXPENSE" | "INCOME",
					categoryId: formData.categoryId,
					occurredAt: formData.occurredAt.toISOString(),
				})
				toast.success("Transação atualizada com sucesso!")
			} else {
				await createTransaction({
					description: formData.description.trim(),
					amount: Number(formData.amount),
					type: formData.type as "EXPENSE" | "INCOME",
					categoryId: formData.categoryId,
					occurredAt: formData.occurredAt.toISOString(),
				})
				toast.success("Transação criada com sucesso!")
			}

			onOpenChange(false)
			onSuccess()
		} catch {
			toast.error(error || (isEditMode ? "Erro ao atualizar transação" : "Erro ao criar transação"))
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton>
				<DialogHeader>
					<DialogTitle>{isEditMode ? "Editar transação" : "Nova transação"}</DialogTitle>
					<DialogDescription>
						{isEditMode ? "Atualize os dados da transação" : "Registre sua despesa ou receita."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Field>
						<FieldLabel htmlFor="transaction-type">Tipo</FieldLabel>
						<ToggleGroup
							value={[formData.type]}
							onValueChange={(value) => setFormData({ ...formData, type: value[0] })}
							variant="outline"
							className="border p-2"
						>
							{transactionTypesOptions.map((option) => (
								<ToggleGroupItem key={option.value}
									value={option.value}
									aria-label={option.value}
									data-value={option.value}
									data-pressed={option.value === formData.type}
									className={cn(
										"flex-1 group data-[pressed=false]:border-0",
										"data-[value=EXPENSE]:border-red-base data-[value=INCOME]:border-green-base",
										"data-[pressed=true]:text-gray-800 data-[pressed=false]:font-normal data-[pressed=false]:text-gray-600"
									)}
								>
									<span className={cn(
										"group-data-[pressed=true]:group-data-[value=EXPENSE]:text-red-base group-data-[pressed=true]:group-data-[value=INCOME]:text-green-base",
									)}>
										{option.icon}
									</span>
									{option.label}
								</ToggleGroupItem>

							))}
						</ToggleGroup>
					</Field>

					<Field>
						<FieldLabel htmlFor="transaction-description">Descrição</FieldLabel>
						<Input
							id="transaction-description"
							placeholder="Ex.: Almoço no restaurante"
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							disabled={isSubmitting}
							required
						/>
					</Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<Field>
							<FieldLabel htmlFor="transaction-occurredAt">Data</FieldLabel>
							<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
								<PopoverTrigger render={<Button variant="outline" id="date" className="justify-start font-normal">{formData.occurredAt ? format(formData.occurredAt) : "Select date"}</Button>} />
								<PopoverContent className="w-auto overflow-hidden p-0" align="start">
									<Calendar
										id="transaction-occurredAt"
										disabled={isSubmitting}
										required
										mode="single"
										selected={formData.occurredAt}
										defaultMonth={formData.occurredAt}
										captionLayout="dropdown"
										onSelect={(date) => {
											setFormData({ ...formData, occurredAt: date })
											setIsCalendarOpen(false)
										}}
									/>
								</PopoverContent>
							</Popover>
						</Field>

						<Field>
							<FieldLabel htmlFor="transaction-amount">Valor</FieldLabel>
							<InputGroup>
								<InputGroupAddon>
									R$
								</InputGroupAddon>
								<InputGroupInput
									id="transaction-amount"
									placeholder="0.00"
									type="number"
									min={0}
									step="0.01"
									value={formData.amount}
									onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
									disabled={isSubmitting}
									required
								/>
							</InputGroup>
						</Field>
					</div>

					<Field>
						<FieldLabel htmlFor="transaction-category">Categoria</FieldLabel>
						<Select
							value={formData.categoryId}
							onValueChange={(value) => setFormData({ ...formData, categoryId: value! })}
							id="transaction-category"
							items={categorySelectItems}
							required
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Nenhuma categoria</SelectItem>
								{categorySelectItems.map((category) => (
									<SelectItem key={category.value} value={category.value}>
										{category.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>

					<DialogFooter>
						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Salvando..." : isEditMode ? "Atualizar" : "Salvar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
