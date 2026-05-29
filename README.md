# d4sign-web

Frontend Next.js (iframe Bitrix em **http://127.0.0.1:3000**).

## Dev

1. Backend rodando em `:3001` com ngrok (ver `d4sign-api`)
2. `.env`: `NEXT_PUBLIC_API_URL=https://<seu-ngrok>`
3. `npm install` → `npm run dev` (porta **3000**)

## Bitrix24 (dev local)

| Campo | URL |
|-------|-----|
| Manipulador | `http://127.0.0.1:3000/` ou `/bitrix/login` |
| Instalação / robô | `https://<ngrok>/...` (api) |
