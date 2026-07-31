import { api } from "@/api/apollo"
import { DASHBOARD } from "@/api/query/Dashboard"
import type { DashboardData } from "@/types"
import { create } from "zustand"

interface DashboardState {
	data: DashboardData | null
	isLoading: boolean
	error: string | null
	fetchDashboard: () => Promise<void>
	setData: (data: DashboardData) => void
	setError: (error: string | null) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
	data: null,
	isLoading: false,
	error: null,
	fetchDashboard: async () => {
		try {
			set({ isLoading: true, error: null })
			const { data } = await api.query({ query: DASHBOARD })

			if (data?.dashboard) {
				set({ data: data.dashboard, isLoading: false })
				return
			}

			set({ isLoading: false })
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Error fetching dashboard"
			set({ error: errorMessage, isLoading: false })
			throw error
		}
	},
	setData: (data) => {
		set({ data })
	},
	setError: (error) => {
		set({ error })
	},
}))
