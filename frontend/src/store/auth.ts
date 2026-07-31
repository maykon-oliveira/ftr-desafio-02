import { api } from "@/api/apollo"
import { LOGIN } from "@/api/mutation/Login"
import { REGISTER } from "@/api/mutation/Register"
import { UPDATE_USER, type UpdateUserInput } from "@/api/mutation/UpdateUser"
import type { LoginInput, RegisterUserInput, User } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	login: (data: LoginInput) => Promise<boolean>
	signup: (data: RegisterUserInput) => Promise<boolean>
	updateUser: (data: UpdateUserInput) => Promise<boolean>
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			login: async (loginInput: LoginInput) => {
				try {
					const { data } = await api.mutate({
						mutation: LOGIN,
						variables: {
							data: {
								email: loginInput.email,
								password: loginInput.password
							}
						}
					})

					if (data?.login) {
						const { user, token } = data.login
						set({
							user: {
								id: user.id,
								name: user.name,
								email: user.email,
								role: user.role,
							},
							token,
							isAuthenticated: true
						})
						return true
					}

					return false
				} catch (error) {
					console.log("Erro ao fazer o login")
					throw error
				}
			},
			signup: async (registerData: RegisterUserInput) => {
				try {
					const { data } = await api.mutate({
						mutation: REGISTER,
						variables: {
							data: {
								name: registerData.name,
								email: registerData.email,
								password: registerData.password
							}
						}
					})
					if (data?.registerUser) {
						const { token, user } = data.registerUser
						set({
							user: {
								id: user.id,
								name: user.name,
								email: user.email,
								role: user.role,
								createdAt: user.createdAt,
								updatedAt: user.updatedAt
							},
							token,
							isAuthenticated: true
						})

						return true
					}

					return false
				} catch (error) {
					console.log("Erro ao fazer o cadastro")
					throw error
				}
			},
			logout: () => {
				set({
					user: null,
					token: null,
					isAuthenticated: false
				})
				api.clearStore()
			},
			updateUser: async (updateData: UpdateUserInput) => {
				try {
					const { data } = await api.mutate({
						mutation: UPDATE_USER,
						variables: {
							data: updateData,
						},
					})

					if (data?.updateUser) {
						const { user } = data.updateUser
						set({
							user: {
								id: user.id,
								name: user.name,
								email: user.email,
								role: user.role,
								createdAt: user.createdAt,
								updatedAt: user.updatedAt,
							},
						})
						return true
					}

					return false
				} catch (error) {
					console.log("Erro ao atualizar perfil")
					throw error
				}
			},
		}),
		{
			name: 'auth-storage'
		}
	)
)