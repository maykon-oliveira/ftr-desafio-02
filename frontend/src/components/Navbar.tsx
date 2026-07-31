import logo from "@/assets/logo.svg"
import { NavLink } from "react-router-dom"
import { useAuthStore } from "@/store/auth"

export function Navbar() {
	const user = useAuthStore(state => state.user)

	function initials(name: string) {
		const trimmed = name.trim()
		if (!trimmed) return ""

		const parts = trimmed.split(/\s+/)
		if (parts.length === 1) {
			return parts[0].slice(0, 2).toUpperCase()
		}

		return parts.slice(0, 2).map(part => part[0].toUpperCase()).join("")
	}

	const links = [
		{ label: "Dashboard", to: "/" },
		{ label: "Transações", to: "/transactions" },
		{ label: "Categorias", to: "/categories" },
	]

	return (
		<div className="flex justify-between items-center px-10 py-5 bg-white shadow">
			<img src={logo} />
			<div className="gap-5 flex">
				{links.map(link => (
					<NavLink
						key={link.to}
						to={link.to}
						className={({ isActive }) => `text-sm ${isActive ? "text-brand-base" : "hover:text-brand-dark"}`}>
						{link.label}
					</NavLink>
				))}
			</div>
			<NavLink to={"/profile"} className="bg-gray-300 rounded-full p-1">
				{user?.name ? initials(user.name) : ""}
			</NavLink>
		</div >
	)
}
