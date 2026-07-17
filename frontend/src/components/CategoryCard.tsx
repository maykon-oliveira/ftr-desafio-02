import type { Category } from "@/types"
import { Button, buttonVariants } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Icon } from "./icon/Icon"
import type { IconType } from "./icon/type"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

interface CategoryCardProps {
	category: Category
	onEdit: (category: Category) => void
}

export function CategoryCard({ category, onEdit }: CategoryCardProps) {
	return (
		<Card >
			<CardHeader className="flex items-center justify-between">
				<div className={cn(buttonVariants({ size: "icon" }))} style={{ backgroundColor: category.color }}>
					<Icon iconName={category.icon as IconType} />
				</div>
				<div className="flex gap-2">
					<Button
						size="icon"
						variant="destructive"
					>
						<Icon iconName="trash" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						onClick={() => onEdit(category)}
					>
						<Icon iconName="square-pen" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<h3 className="font-semibold">{category.name}</h3>
				{category.description && (
					<p className="text-xs text-muted-foreground">{category.description}</p>
				)}
			</CardContent>
			<CardFooter className="items-center justify-between">
				<Badge style={{ backgroundColor: category.color }}>
					{category.name}
				</Badge>
			</CardFooter>
		</Card>
	)
}