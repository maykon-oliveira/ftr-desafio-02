import { Toaster } from "./ui/sonner"

interface LayoutProps {
	children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
	return (
		<div className="min-h-screen bg-gray-100">
			{/* <Header /> */}
			<main>{children}</main>
			<Toaster />
		</div>
	)
}