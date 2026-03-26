<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12Z8Ij7jOk_vRtPj2FwayiiJTqBgr0cuM

## Como iniciar

### Frontend:
1. Instale dependências `pnpm install`
2. Configure `.env.local`
3. Execute `npm run dev`

### Backend (Railway Deploy Mode):
O backend foi completamente migrado de SQLite para **PostgreSQL com Prisma ORM** e preparado para rodar separadamente do Frontend em um serviço próprio no Railway.

1. **Estrutura**: Todo o código relativo à API está em `server/` (feito em TS e compilado para `dist/`).
2. **Deploy no Railway**:
   - Conecte este GitHub Repository em um novo projeto Railway.
   - Provisione o plugin **PostgreSQL** dentro do projeto Railway.
   - Crie um "New Service" a partir do repositório, vá nas configurações (Settings) e defina o **Root Directory** como `/server`.
   - Adicione a variável `DATABASE_URL` conectando o plugin do Postgres (no formato `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`).
   - Configure a variável `FRONTEND_URL` para o endereço remoto do seu frontend em produção (útil para o CORS).
3. **Migrations**: 
   - A configuração `server/railway.toml` já tem o Start Command embutido (`npx prisma migrate deploy && npm start`).
   - A primeira migration será gerada e executada de imediato contra seu banco de dados na nuvem assim que o Railway buildar o app.
