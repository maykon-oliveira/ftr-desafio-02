export interface User {
	id: string
	name: string
	email: string
	role?: string
	createdAt?: string
	updatedAt?: string
}

export interface LoginInput {
	email: string
	password: string
}

export interface RegisterUserInput {
	name: string
	email: string
	password: string
}

export interface Category {
	id: string
	name: string
	description?: string
	icon: string
	color: string
	userId: string
	createdAt: string
	updatedAt: string
	transactionsCount?: number
}

export type TransactionType = "EXPENSE" | "INCOME"

export interface Transaction {
	id: string
	description: string
	amount: number
	type: TransactionType
	category: Pick<Category, "id" | "name" | "icon" | "color">
	occurredAt: string
	createdAt: string
	updatedAt: string
	userId: string
}

export interface CategoryTotal {
	categoryId: string
	categoryName: string
	icon: string
	color: string
	total: number
	transactionsCount: number
}

export interface DashboardData {
	totalBalance: number
	monthlyIncome: number
	monthlyExpense: number
	lastTransactions: Transaction[]
	categoryTotals: CategoryTotal[]
}