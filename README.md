# AWS SaaS Smoke Test

Aplicação fullstack mínima para validar uma stack simples com:

- Next.js
- Prisma
- PostgreSQL no Amazon RDS
- Deploy no AWS App Runner

## Ambiente local

Crie um arquivo `.env` com:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@SEU_HOST:5432/smoketest?schema=public"
```

Depois rode:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

## Deploy

O App Runner usa o arquivo [`apprunner.yaml`](./apprunner.yaml).
