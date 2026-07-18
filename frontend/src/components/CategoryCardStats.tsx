import { Stat, StatIndicator, StatLabel, StatValue } from "@/components/ui/stat"
import { useCategoryStore } from "@/store/category"
import { Icon } from "./icon/Icon"
import type { IconType } from "./icon/type"
import { cn } from "@/lib/utils"
import { colorsVariant, type ColorsType } from "@/lib/colors"


export function CategoryStats() {
	const categories = useCategoryStore((state) => state.categories)
	const total = categories.length
	const totalTransactions = categories.reduce((acc, curr) => acc + (curr.transactionsCount ?? 0), 0)
	const mostUsedCategory = categories[0]
	const color = colorsVariant[(mostUsedCategory?.color as ColorsType) || "green"];

	return (
		<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
			<Stat>
				<StatLabel>Total de categorias</StatLabel>
				<StatIndicator variant="icon" color="success">
					<Icon iconName="tag" />
				</StatIndicator>
				<StatValue>{total}</StatValue>
			</Stat>

			<Stat>
				<StatLabel>Total de transações</StatLabel>
				<StatIndicator variant="icon" color="success">
					<Icon iconName="arrowUpDown" />
				</StatIndicator>
				<StatValue>{totalTransactions}</StatValue>
			</Stat>

			{mostUsedCategory && (
				<Stat>
					<StatLabel>Categoria mais utilizada</StatLabel>
					<StatIndicator variant="icon">
						<Icon iconName={mostUsedCategory.icon as IconType} className={cn(color.text)} />
					</StatIndicator>
					<StatValue>{mostUsedCategory.name}</StatValue>
				</Stat>
			)}

		</div>
	)
}