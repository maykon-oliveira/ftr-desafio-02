import { Navbar } from "./Navbar"

interface LayoutProps {
	children: React.ReactNode
}

export function DashboardLayout({ children }: LayoutProps) {
	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="p-10">
				{children}
			</div>
		</div>
	)
}