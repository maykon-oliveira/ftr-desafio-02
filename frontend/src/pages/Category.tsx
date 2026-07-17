import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { NewCategoryModal } from "@/components/NewCategoryModal"
import { useCategoryStore } from "@/store/category"
import { toast } from "sonner"
import type { Category } from "@/types"
import { CategoryCard } from "@/components/CategoryCard"
import { Icon } from "@/components/icon/Icon"

export function Category() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
	const { categories, fetchCategories, isLoading } = useCategoryStore()

	useEffect(() => {
		fetchCategories().catch(() => {
			toast.error("Erro ao carregar categorias")
		})
	}, [fetchCategories])

	const handleCreateNew = () => {
		setSelectedCategory(undefined)
		setIsModalOpen(true)
	}

	const handleEdit = (category: Category) => {
		setSelectedCategory(category)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedCategory(undefined)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Categorias</h1>
					<p className="text-sm text-muted-foreground">Organize suas transações por categorias</p>
				</div>
				<Button onClick={handleCreateNew}>
					<Icon iconName="plus" />
					Nova categoria
				</Button>
			</div>

			<NewCategoryModal
				isOpen={isModalOpen}
				onOpenChange={handleCloseModal}
				category={selectedCategory}
				onSuccess={() => { }}
			/>

			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">Carregando categorias...</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{categories.map((category) => <CategoryCard key={category.id} category={category} onEdit={handleEdit} />)}
				</div>
			)}
		</div>
	)
}