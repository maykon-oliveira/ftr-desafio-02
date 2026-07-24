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
import { cn } from "@/lib/utils"
import { colorsVariant, colors, type ColorsType } from "@/lib/colors"

interface NewCategoryModalProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => void
	category?: Category
}

const presetIcons: IconType[] = [
	"shoppingCart",
	"utensils",
	"house",
	"dumbbell",
	"heartPulse",
	"bookOpen",
	"briefcaseBusiness",
	"gift",
	"wallet",
	"piggyBank",
	"carFront",
	"receiptText",
	"tag",
	"toolCase",
	"ticket",
	"pawPrint",
];

export function NewCategoryModal({
	isOpen,
	onOpenChange,
	onSuccess,
	category,
}: NewCategoryModalProps) {
	const [formData, setFormData] = useState<{
		name: string,
		description: string,
		icon: string,
		color: ColorsType,
	}>({
		name: "",
		description: "",
		icon: "",
		color: "green",
	})
	const { createCategory, updateCategory, isLoading, error } = useCategoryStore()

	const isEditMode = !!category

	useEffect(() => {
		if (category && isOpen) {
			setFormData({
				name: category.name,
				description: category.description || "",
				icon: category.icon,
				color: category.color as ColorsType,
			})
		} else if (isOpen && !category) {
			setFormData({
				name: "",
				description: "",
				icon: "",
				color: "green",
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
				color: "green",
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
							required
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
									variant="outline"
									size="icon"
									onClick={() => setFormData({ ...formData, icon: iconName })}
									disabled={isLoading}
									title={iconName}
									className={cn(
										formData.icon === iconName ? `${colorsVariant[formData.color].bg} text-white hover:text-white` : ""
									)}
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
							{colors.map((color) => (
								<Button
									variant="ghost"
									size="icon"
									type="button"
									className={cn(
										"border p-1 flex-1",
										color === formData.color
											? colorsVariant[color].border
											: "border-gray-300 hover:border-gray-400"
									)}
									onClick={() => setFormData({ ...formData, color: color })}
									disabled={isLoading}
								>
									<div
										className={cn(colorsVariant[color].bg, "size-full rounded")}
									/>
								</Button>
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
