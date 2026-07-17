import { api } from "@/api/apollo"
import { CREATE_CATEGORY, type CreateCategoryInput } from "@/api/mutation/CreateCategory"
import { UPDATE_CATEGORY, type UpdateCategoryInput } from "@/api/mutation/UpdateCategory"
import { LIST_CATEGORIES } from "@/api/query/ListCategories"
import type { Category } from "@/types"
import { create } from "zustand"

interface CategoryState {
	categories: Category[]
	isLoading: boolean
	error: string | null
	createCategory: (data: CreateCategoryInput) => Promise<Category | null>
	updateCategory: (id: string, data: UpdateCategoryInput) => Promise<Category | null>
	fetchCategories: () => Promise<void>
	setCategories: (categories: Category[]) => void
	setError: (error: string | null) => void
}

export const useCategoryStore = create<CategoryState>((set) => ({
	categories: [],
	isLoading: false,
	error: null,
	createCategory: async (createCategoryInput: CreateCategoryInput) => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.mutate({
				mutation: CREATE_CATEGORY,
				variables: {
					data: {
						name: createCategoryInput.name,
						description: createCategoryInput.description,
						icon: createCategoryInput.icon,
						color: createCategoryInput.color,
					},
				},
			})

			if (data?.createCategory) {
				const newCategory = data.createCategory.category
				set((state) => ({
					categories: [...state.categories, newCategory],
					isLoading: false,
				}))
				return newCategory
			}

			set({ isLoading: false })
			return null
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error creating category"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	updateCategory: async (id: string, updateCategoryInput: UpdateCategoryInput) => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.mutate({
				mutation: UPDATE_CATEGORY,
				variables: {
					id,
					data: {
						name: updateCategoryInput.name,
						description: updateCategoryInput.description,
						icon: updateCategoryInput.icon,
						color: updateCategoryInput.color,
					},
				},
			})

			if (data?.updateCategory) {
				const updatedCategory = data.updateCategory.category
				set((state) => ({
					categories: state.categories.map((cat) =>
						cat.id === id ? updatedCategory : cat
					),
					isLoading: false,
				}))
				return updatedCategory
			}

			set({ isLoading: false })
			return null
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error updating category"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	fetchCategories: async () => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.query({
				query: LIST_CATEGORIES,
			})

			if (data?.listCategories) {
				set({
					categories: data.listCategories.categories,
					isLoading: false,
				})
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error fetching categories"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	setCategories: (categories: Category[]) => {
		set({ categories })
	},
	setError: (error: string | null) => {
		set({ error })
	},
}))
