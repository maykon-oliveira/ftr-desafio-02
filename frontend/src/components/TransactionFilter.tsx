import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TransactionType } from "@/types"
import type { TransactionFilters } from "@/api/query/ListTransactions"
import { useCategoryStore } from "@/store/category"
import { useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Field, FieldLabel } from "./ui/field"

const MONTH_NAMES = [
	"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
	"Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

function generateMonthOptions() {
	const options: { label: string; value: string }[] = []
	const now = new Date()
	const currentMonth = now.getMonth() + 1
	const currentYear = now.getFullYear()

	// Generate the last 24 months
	for (let i = 0; i < 24; i++) {
		const d = new Date(currentYear, currentMonth - 1 - i, 1)
		const month = d.getMonth() + 1
		const year = d.getFullYear()
		options.push({
			label: `${MONTH_NAMES[month - 1]}/${year}`,
			value: `${month}-${year}`,
		})
	}

	return options
}

const MONTH_OPTIONS = generateMonthOptions()

const TYPE_OPTIONS: { label: string; value: string }[] = [
	{ label: "Todos", value: "" },
	{ label: "Despesa", value: "EXPENSE" },
	{ label: "Receita", value: "INCOME" },
]

interface TransactionFilterProps {
	filters: TransactionFilters
	onFiltersChange: (filters: TransactionFilters) => void
}

export function TransactionFilter({ filters, onFiltersChange }: TransactionFilterProps) {
	const categories = useCategoryStore(store => store.categories)
	const fetchCategories = useCategoryStore(store => store.fetchCategories)

	useEffect(() => {
		fetchCategories()
	}, [fetchCategories])

	const categoryOptions = [
		{ label: "Todas", value: "" },
		...categories.map(({ id, name }) => ({ label: name, value: id })),
	]

	function handleDescriptionChange(value: string) {
		onFiltersChange({ ...filters, description: value || undefined })
	}

	function handleTypeChange(value: string) {
		onFiltersChange({ ...filters, type: (value || undefined) as TransactionType | undefined })
	}

	function handleCategoryChange(value: string) {
		onFiltersChange({ ...filters, categoryId: value || undefined })
	}

	function handlePeriodChange(value: string) {
		if (!value) {
			const { month, year, ...rest } = filters
			onFiltersChange(rest)
			return
		}
		const [monthStr, yearStr] = value.split("-")
		onFiltersChange({
			...filters,
			month: Number.parseInt(monthStr, 10),
			year: Number.parseInt(yearStr, 10),
		})
	}

	const currentPeriodValue = filters.month && filters.year
		? `${filters.month}-${filters.year}`
		: ""

	return (
		<Card>
			<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Field>
					<FieldLabel>Buscar</FieldLabel>
					<Input
						placeholder="Buscar por descrição"
						value={filters.description ?? ""}
						onChange={(e) => handleDescriptionChange(e.target.value)}
					/>
				</Field>

				<Field>
					<FieldLabel>Tipo</FieldLabel>
					<Select
						value={filters.type ?? ""}
						onValueChange={(value) => handleTypeChange(value!)}
						items={TYPE_OPTIONS}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Todos" />
						</SelectTrigger>
						<SelectContent>
							{TYPE_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				<Field>
					<FieldLabel>Categoria</FieldLabel>
					<Select
						value={filters.categoryId ?? ""}
						onValueChange={(value) => handleCategoryChange(value!)}
						items={categoryOptions}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Todas" />
						</SelectTrigger>
						<SelectContent>
							{categoryOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				<Field>
					<FieldLabel>Período</FieldLabel>
					<Select
						value={currentPeriodValue}
						onValueChange={(value) => handlePeriodChange(value!)}
						items={MONTH_OPTIONS}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Todos" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Todos</SelectItem>
							{MONTH_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			</CardContent>
		</Card>
	)
}
