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
import { Field, FieldDescription, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { LogInIcon } from "lucide-react"

export function SignUp() {
	const [name, setName] = useState("Maykon")
	const [email, setEmail] = useState("maykon@email.com")
	const [password, setPassword] = useState("12345678")
	const [loading, setLoading] = useState(false)
	const signup = useAuthStore((state) => state.signup)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const signupMutate = await signup({
				name,
				email,
				password,
			})
			if (signupMutate) {
				toast.success("Cadastro realizado com sucesso!")
			}
		} catch (error: any) {
			toast.error(error?.message || "Falha ao realizar cadastro")
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
						Criar conta
					</CardTitle>
					<CardDescription>
						Comece a controlar suas finanças ainda hoje
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldSet>
							<Field>
								<FieldLabel htmlFor="name">Nome completo</FieldLabel>
								<Input
									id="name"
									type="name"
									placeholder="Seu nome completo"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</Field>
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
								<FieldDescription>
									A senha deve ter no mínimo 8 caracteres
								</FieldDescription>
							</Field>

							<Button type="submit" className="w-full bg-brand-base" disabled={loading}>
								Criar conta
							</Button>

							<FieldSeparator>ou</FieldSeparator>

							<div className="flex flex-col space-y-5 items-center">
								<p className="text-gray-600">Já tem uma conta?</p>

								<Link to="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
									<LogInIcon />
									Fazer login
								</Link>
							</div>
						</FieldSet>

					</form>

				</CardContent>
			</Card>
		</div>
	)
}