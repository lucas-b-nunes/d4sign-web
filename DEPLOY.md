# d4sign-web — Deploy (Vercel)

## Deploy automático

Todo `git push origin main` dispara um deploy automático no Vercel.

---

## Configuração inicial (primeira vez)

### 1. Importar projeto no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório `d4sign-web`
3. Framework: **Next.js** (detectado automaticamente)
4. Root Directory: `.` (raiz do repositório)

### 2. Variáveis de ambiente

No painel do Vercel → **Settings → Environment Variables**:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `NEXT_PUBLIC_API_URL` | `https://api.SEU_DOMINIO.com` | Production, Preview, Development |

### 3. Domínio customizado (opcional)

Vercel → **Settings → Domains** → adicione `app.SEU_DOMINIO.com`.

---

## Desenvolvimento local

```bash
cp .env.example .env
# Preencha NEXT_PUBLIC_API_URL com a URL local ou ngrok da API

pnpm install
pnpm dev
```

---

## URL para cadastrar no Bitrix24

| Campo | URL |
|-------|-----|
| Manipulador (iframe) | `https://app.SEU_DOMINIO.com/` ou URL do Vercel |
