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
}