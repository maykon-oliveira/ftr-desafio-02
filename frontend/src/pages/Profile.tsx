import { useState } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { Field, FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field"
import { useNavigate } from "react-router-dom"
import { LogOutIcon, MailIcon, UserIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

function initials(name: string) {
	const trimmed = name.trim()
	if (!trimmed) return ""

	const parts = trimmed.split(/\s+/)
	if (parts.length === 1) {
		return parts[0].slice(0, 2).toUpperCase()
	}

	return parts.slice(0, 2).map(part => part[0].toUpperCase()).join("")
}

export function Profile() {
	const user = useAuthStore(state => state.user)
	const logout = useAuthStore(state => state.logout)
	const navigate = useNavigate()
	const updateUser = useAuthStore(state => state.updateUser)

	const [name, setName] = useState(user?.name ?? "")
	const [loading, setLoading] = useState(false)

	if (!user) {
		return;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			if (name.trim() === user.name) {
				toast.info("Nenhuma alteração realizada")
				setLoading(false)
				return
			}

			const success = await updateUser({ name: name.trim() })
			if (success) {
				toast.success("Perfil atualizado com sucesso!")
			}
		} catch (error: unknown) {
			toast.error(error?.message || "Erro ao atualizar perfil")
		} finally {
			setLoading(false)
		}
	}

	function handleLogout() {
		logout()
		navigate("/login")
	}

	return (
		<div className="flex flex-col items-center justify-center gap-6">
			<Card className="w-full max-w-md rounded-xl">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-5">
						<div className="bg-gray-300 rounded-full p-3">
							{user?.name ? initials(user.name) : ""}
						</div>
					</div>
					<CardTitle className="text-2xl font-bold">
						{user.name}
					</CardTitle>
					<CardDescription>
						{user.email}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-8">
						<FieldSet>
							<Field>
								<FieldLabel htmlFor="name">Nome completo</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<UserIcon />
									</InputGroupAddon>
									<InputGroupInput
										id="name"
										type="text"
										placeholder="Seu nome completo"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</InputGroup>
							</Field>
							<Field>
								<FieldLabel htmlFor="email">E-mail</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<MailIcon />
									</InputGroupAddon>
									<InputGroupInput
										id="email"
										type="email"
										value={user.email ?? ""}
										disabled
										className="opacity-60 cursor-not-allowed"
									/>
								</InputGroup>
								<FieldDescription>O email não pode ser alterado</FieldDescription>
							</Field>

						</FieldSet>
						<div className="space-y-3">
							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? "Salvando..." : "Salvar alterações"}
							</Button>

							<Button type="button" className="w-full" disabled={loading} onClick={handleLogout} variant={"outline"}>
								<LogOutIcon className="text-destructive" />
								Sair da conta
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
