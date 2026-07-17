import { useState, useEffect } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCategoryStore } from "@/store/category"
import { toast } from "sonner"
import { Field, FieldDescription, FieldLabel } from "./ui/field"
import type { Category } from "@/types"
import { Icon } from "./icon/Icon"
import type { IconType } from "./icon/type"

interface NewCategoryModalProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => void
	category?: Category
}

const presetColors = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
	"#64748b",
];

const presetIcons: IconType[] = [
	"shopping-cart",
	"utensils",
	"house",
	"dumbbell",
	"heart-pulse",
	"book-open",
	"briefcase-business",
	"gift",
	"wallet",
	"piggy-bank",
	"car-front",
	"receipt-text",
	"tag",
	"tool-case",
	"ticket",
	"paw-print",
] as const;

export function NewCategoryModal({
	isOpen,
	onOpenChange,
	onSuccess,
	category,
}: NewCategoryModalProps) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		icon: "",
		color: "",
	})
	const { createCategory, updateCategory, isLoading, error } = useCategoryStore()

	const isEditMode = !!category

	useEffect(() => {
		if (category && isOpen) {
			setFormData({
				name: category.name,
				description: category.description || "",
				icon: category.icon,
				color: category.color,
			})
		} else if (isOpen && !category) {
			setFormData({
				name: "",
				description: "",
				icon: "",
				color: "",
			})
		}
	}, [category, isOpen])

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault()

		if (!formData.name.trim()) {
			toast.error("Digite um nome para a categoria")
			return
		}

		if (!formData.icon) {
			toast.error("Selecione um ícone")
			return
		}

		if (!formData.color) {
			toast.error("Selecione uma cor")
			return
		}

		try {
			if (isEditMode && category) {
				await updateCategory(category.id, {
					name: formData.name.trim(),
					description: formData.description.trim() || undefined,
					icon: formData.icon,
					color: formData.color,
				})
				toast.success("Categoria atualizada com sucesso!")
			} else {
				await createCategory({
					name: formData.name.trim(),
					description: formData.description.trim() || undefined,
					icon: formData.icon,
					color: formData.color,
				})
				toast.success("Categoria criada com sucesso!")
			}
			setFormData({
				name: "",
				description: "",
				icon: "",
				color: "",
			})
			onOpenChange(false)
			onSuccess()
		} catch {
			toast.error(error || (isEditMode ? "Erro ao atualizar categoria" : "Erro ao criar categoria"))
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton>
				<DialogHeader>
					<DialogTitle>{isEditMode ? "Editar categoria" : "Nova categoria"}</DialogTitle>
					<DialogDescription>
						{isEditMode ? "Atualize os dados da categoria" : "Organize suas transações com categorias."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Field>
						<FieldLabel htmlFor="category-name">
							Título
						</FieldLabel>
						<Input
							id="category-name"
							placeholder="Ex. Alimentação"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							disabled={isLoading}
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="category-description">
							Descrição
						</FieldLabel>
						<Input
							id="category-description"
							placeholder="Descrição da categoria"
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							disabled={isLoading}
						/>
						<FieldDescription>Opcional</FieldDescription>
					</Field>

					<Field>
						<FieldLabel>
							Ícone
						</FieldLabel>
						<div className="grid grid-cols-8 gap-2">
							{presetIcons.map((iconName) => (
								<Button
									key={iconName}
									type="button"
									variant={formData.icon === iconName ? "default" : "outline"}
									size="icon"
									onClick={() => setFormData({ ...formData, icon: iconName })}
									disabled={isLoading}
									title={iconName}
								>
									<Icon iconName={iconName} />
								</Button>
							))}
						</div>
					</Field>

					<Field>
						<FieldLabel htmlFor="category-color">
							Cor
						</FieldLabel>
						<div className="flex gap-2">
							{presetColors.map((presetColor) => (
								<Button
									key={presetColor}
									type="button"
									size="icon"
									className="flex-1"
									style={{
										backgroundColor: presetColor,
										border: formData.color === presetColor ? "2px solid #000" : "none",
									}}
									onClick={() => setFormData({ ...formData, color: presetColor })}
									disabled={isLoading}
								/>
							))}
						</div>
					</Field>

					<DialogFooter>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full"
						>
							{isLoading ? "Salvando..." : isEditMode ? "Atualizar" : "Salvar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
