# Backend

Configuração inicial do backend com Bun + TypeScript + GraphQL + Prisma + SQLite.

## Requisitos

- Bun instalado

## Setup do ambiente

1. Instalar dependências:

```bash
bun install
```

2. Criar arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

3. Gerar Prisma Client:

```bash
bun run generate
```

4. Rodar o backend em modo desenvolvimento:

```bash
bun run dev
```

## Variáveis de ambiente

Arquivo `.env.example`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-here"
```

## Scripts disponíveis

- `bun run dev`
- `bun run generate`
- `bun run migrate`
- `bun run seed`
