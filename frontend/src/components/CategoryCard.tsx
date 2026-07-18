import type { Category } from "@/types"
import { Button, buttonVariants } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Icon } from "./icon/Icon"
import type { IconType } from "./icon/type"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { useCategoryStore } from "@/store/category"
import { toast } from "sonner"
import { colorsVariant, type ColorsType } from "@/lib/colors"

interface CategoryCardProps {
	category: Category
	onEdit: (category: Category) => void
}

export function CategoryCard({ category, onEdit }: CategoryCardProps) {
	const deleteCategory = useCategoryStore((state) => state.deleteCategory)
	const isLoading = useCategoryStore((state) => state.isLoading)

	const handleDelete = async () => {
		try {
			await deleteCategory(category.id)
			toast.success("Categoria removida com sucesso!")
		} catch {
			toast.error("Erro ao remover categoria")
		}
	}

	const color = colorsVariant[category.color as ColorsType];

	return (
		<Card className="justify-between">
			<CardHeader className="flex items-center justify-between">
				<div className={cn(buttonVariants({ size: "icon-lg" }), color.light, color.text)}>
					<Icon iconName={category.icon as IconType} />
				</div>
				<div className="flex gap-2">
					<Button
						size="icon"
						variant="outline"
						onClick={handleDelete}
						disabled={isLoading}
					>
						<Icon iconName="trash" className="text-destructive" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						onClick={() => onEdit(category)}
					>
						<Icon iconName="squarePen" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<h3 className="font-semibold text-2xl">{category.name}</h3>
				{category.description && (
					<p className="text-xs text-muted-foreground">{category.description}</p>
				)}
			</CardContent>
			<CardFooter className="items-center justify-between">
				<Badge className={cn(color.light, color.text)}>
					{category.name}
				</Badge>
				<p className="text-muted-foreground">
					{(category.transactionsCount ?? 0) === 1
						? "1 item"
						: `${category.transactionsCount ?? 0} itens`}
				</p>
			</CardFooter>
		</Card>
	)
}