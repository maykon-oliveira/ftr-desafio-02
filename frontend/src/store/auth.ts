import { api } from "@/api/apollo"
import { LOGIN } from "@/api/mutation/Login"
import type { LoginInput, User } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	login: (data: LoginInput) => Promise<boolean>
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
							email: loginInput.email,
							password: loginInput.password
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
			logout: () => {
				set({
					user: null,
					token: null,
					isAuthenticated: false
				})
				api.clearStore()
			},
		}),
		{
			name: 'auth-storage'
		}
	)
)