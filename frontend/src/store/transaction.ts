import { api } from "@/api/apollo"
import { CREATE_TRANSACTION, type CreateTransactionInput } from "@/api/mutation/CreateTransaction"
import { DELETE_TRANSACTION } from "@/api/mutation/DeleteTransaction"
import { LIST_TRANSACTIONS, type TransactionFilters } from "@/api/query/ListTransactions"
import { UPDATE_TRANSACTION, type UpdateTransactionInput } from "@/api/mutation/UpdateTransaction"
import type { Transaction } from "@/types"
import { create } from "zustand"

interface TransactionState {
	transactions: Transaction[]
	isLoading: boolean
	error: string | null
	fetchTransactions: (filters?: TransactionFilters) => Promise<void>
	createTransaction: (input: CreateTransactionInput) => Promise<Transaction | null>
	updateTransaction: (id: string, input: UpdateTransactionInput) => Promise<Transaction | null>
	deleteTransaction: (id: string) => Promise<boolean>
	setTransactions: (transactions: Transaction[]) => void
	setError: (error: string | null) => void
}

export const useTransactionStore = create<TransactionState>((set) => ({
	transactions: [],
	isLoading: false,
	error: null,
	fetchTransactions: async (filters) => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.query({
				query: LIST_TRANSACTIONS,
				variables: { filter: filters },
			})

			if (data?.listTransactions) {
				set({ transactions: data.listTransactions.transactions, isLoading: false })
				return
			}

			set({ isLoading: false })
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error fetching transactions"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	createTransaction: async (createTransactionInput: CreateTransactionInput) => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.mutate({
				mutation: CREATE_TRANSACTION,
				variables: {
					data: {
						description: createTransactionInput.description,
						amount: createTransactionInput.amount,
						type: createTransactionInput.type,
						categoryId: createTransactionInput.categoryId,
						occurredAt: createTransactionInput.occurredAt,
					},
				},
			})

			if (data?.createTransaction) {
				const createdTransaction = data.createTransaction.transaction
				set((state) => ({
					transactions: [...state.transactions, createdTransaction],
					isLoading: false,
				}))
				return createdTransaction
			}

			set({ isLoading: false })
			return null
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error creating transaction"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	updateTransaction: async (id, updateTransactionInput) => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.mutate({
				mutation: UPDATE_TRANSACTION,
				variables: {
					id,
					data: {
						description: updateTransactionInput.description,
						amount: updateTransactionInput.amount,
						type: updateTransactionInput.type,
						categoryId: updateTransactionInput.categoryId,
						occurredAt: updateTransactionInput.occurredAt,
					},
				},
			})

			if (data?.updateTransaction) {
				const updatedTransaction = data.updateTransaction.transaction
				set((state) => ({
					transactions: state.transactions.map((transaction) =>
						transaction.id === id ? updatedTransaction : transaction
					),
					isLoading: false,
				}))
				return updatedTransaction
			}

			set({ isLoading: false })
			return null
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error updating transaction"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	deleteTransaction: async (id) => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.mutate({
				mutation: DELETE_TRANSACTION,
				variables: { id },
			})

			if (data?.deleteTransaction?.success) {
				set((state) => ({
					transactions: state.transactions.filter((transaction) => transaction.id !== id),
					isLoading: false,
				}))
				return true
			}

			set({ isLoading: false })
			return false
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error deleting transaction"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	setTransactions: (transactions) => {
		set({ transactions })
	},
	setError: (error) => {
		set({ error })
	},
}))
