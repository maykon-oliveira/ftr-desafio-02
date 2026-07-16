import { useState } from "react"
import logo from "@/assets/logo.svg"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { UserPlus2Icon } from "lucide-react"

export function Login() {
	const [email, setEmail] = useState("maykon@email.com")
	const [password, setPassword] = useState("12345678")
	const [loading, setLoading] = useState(false)
	const login = useAuthStore((state) => state.login)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const loginMutate = await login({
				email,
				password,
			})
			if (loginMutate) {
				toast.success("Login realizado com sucesso!")
			}
		} catch (error: any) {
			toast.error(error?.message || "Erro ao realizar login")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-6">
			<img src={logo} />
			<Card className="w-full max-w-md rounded-xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Fazer login
					</CardTitle>
					<CardDescription>
						Entre na sua conta para continuar
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldSet>
							<Field>
								<FieldLabel htmlFor="email">E-mail</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="seu@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="email">Senha</FieldLabel>
								<Input
									id="password"
									type="password"
									placeholder="********"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</Field>

							<FieldGroup className="flex-row justify-between">
								<Field className="w-auto" orientation="horizontal">
									<Checkbox id="push-tasks" />
									<FieldLabel htmlFor="push-tasks" className="font-normal">
										Lembrar-me								</FieldLabel>
								</Field>
								<Link className="text-brand-base" to={""}>Recuperar senha</Link>
							</FieldGroup>

							<Button type="submit" className="w-full" disabled={loading}>
								Entrar
							</Button>

							<FieldSeparator>ou</FieldSeparator>

							<div className="flex flex-col space-y-5 items-center">
								<p className="text-gray-600">Ainda não tem uma conta?</p>

								<Link to="/signup" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
									<UserPlus2Icon />
									Criar conta
								</Link>
							</div>
						</FieldSet>

					</form>

				</CardContent>
			</Card>
		</div>
	)
}