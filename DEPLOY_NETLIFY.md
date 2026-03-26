# 🚀 Deploy na Netlify - Guia Completo

## 📌 Visão Geral

A **Netlify** é perfeita para hospedar o **frontend**, mas o **backend Node.js/Express precisa ser hospedado em outro lugar**.

**Solução Recomendada:**
- 🎨 **Frontend React** → Netlify (grátis)
- ⚙️ **Backend Express** → Railway (grátis) ou Render

---

## 🎯 Opção 1: Railway (Backend) + Netlify (Frontend) [RECOMENDADO]

### Por que Railway?
- ✅ **Gratuito** para começar (500h/mês)
- ✅ **Muito fácil** de usar
- ✅ **Deploy automático** do GitHub
- ✅ **Banco PostgreSQL grátis** incluído
- ✅ **Sem cartão de crédito** necessário

### Passo 1: Preparar Backend para Railway

#### 1.1 Criar arquivo `railway.json`

```bash
# Na pasta server/
```

Crie `c:\projetos\saaslucas\server\railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 1.2 Atualizar `package.json` do servidor

Adicione em `server/package.json`:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 1.3 Adicionar arquivo `.gitignore` (se não existir)

```
node_modules/
*.sqlite
.env
*.log
```

### Passo 2: Deploy no Railway

1. **Acesse:** https://railway.app/
2. **Login** com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione** a pasta `server/` do seu repositório
5. **Configure variáveis de ambiente:**
   - `JWT_SECRET` = sua_chave_secreta_forte
   - `PORT` = 3001 (Railway atribui automaticamente)

6. **Deploy!** 🚀

Você receberá uma URL tipo: `https://seu-app.up.railway.app`

### Passo 3: Preparar Frontend para Netlify

#### 3.1 Criar variável de ambiente

Crie `c:\projetos\saaslucas\.env.production`:

```env
VITE_API_URL=https://seu-app.up.railway.app
```

#### 3.2 Atualizar `authService.ts`

Modifique `services/authService.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

#### 3.3 Criar `netlify.toml`

Crie `c:\projetos\saaslucas\netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Passo 4: Deploy na Netlify

1. **Acesse:** https://app.netlify.com/
2. **Add new site** → **Import from Git**
3. **Conecte** seu repositório GitHub
4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - **Environment variables:**
     - `VITE_API_URL` = `https://seu-app.up.railway.app`

5. **Deploy!** 🎉

---

## 🔧 Opção 2: Render (Backend) + Netlify (Frontend)

### Passo 1: Deploy no Render

1. **Acesse:** https://render.com/
2. **New** → **Web Service**
3. **Connect** GitHub repository
4. **Configure:**
   - Name: `saaslucas-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - **Environment variables:**
     - `JWT_SECRET` = sua_chave_forte
     - `NODE_ENV` = production

5. **Plano gratuito** → Create Web Service

URL gerada: `https://saaslucas-backend.onrender.com`

### Passo 2: Mesmo do anterior

Use a URL do Render em `VITE_API_URL` no Netlify.

---

## 🌐 Opção 3: Netlify Functions (Tudo na Netlify)

**⚠️ Requer refatoração do backend**

### O que muda?

Em vez de um servidor Express rodando 24/7, você cria **funções serverless** que são executadas sob demanda.

### Estrutura:

```
netlify/
└── functions/
    ├── login.js
    ├── register.js
    └── verify.js
```

### Exemplo de função:

```javascript
// netlify/functions/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, senha } = JSON.parse(event.body);
  
  // Lógica de autenticação aqui
  // (usar banco externo como Supabase, MongoDB Atlas, etc)
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, user })
  };
}
```

**Problema:** SQLite não funciona bem com serverless (arquivo local). Precisaria usar:
- Supabase (PostgreSQL)
- MongoDB Atlas
- PlanetScale (MySQL)
- FaunaDB

---

## ✅ Checklist de Deploy

### Backend (Railway/Render)
- [ ] Conta criada
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas (`JWT_SECRET`)
- [ ] Deploy realizado
- [ ] URL do backend anotada

### Frontend (Netlify)
- [ ] Arquivo `netlify.toml` criado
- [ ] Variável `VITE_API_URL` configurada
- [ ] `authService.ts` atualizado
- [ ] Deploy realizado
- [ ] Testado login em produção

---

## 🧪 Testar Deployment

1. **Testar backend isolado:**
```bash
curl https://seu-app.up.railway.app/health
```

2. **Testar frontend:**
- Abra sua URL da Netlify
- Tente fazer login
- Abra DevTools (F12) → Network → Veja se calls vão para Railway

3. **Verificar CORS:**
Se der erro de CORS, adicione no backend:

```javascript
// server.js
app.use(cors({
  origin: ['https://seu-site.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

## 💰 Custos

| Serviço | Plano Gratuito | Limite |
|---------|---------------|--------|
| **Netlify** | Sim | 100GB bandwidth/mês |
| **Railway** | Sim | $5 crédito/mês (500h) |
| **Render** | Sim | 750h/mês |

**Total: R$ 0,00** para começar! 🎉

---

## 🆘 Problemas Comuns

### "Network Error" no frontend

**Causa:** CORS ou URL errada

**Solução:**
1. Verifique `VITE_API_URL` no Netlify
2. Adicione domínio Netlify no CORS do backend

### "503 Service Unavailable" no Render

**Causa:** Render hiberna apps gratuitos após 15min de inatividade

**Solução:**
- Primeiro acesso é lento (30s para "acordar")
- Considere Railway (não hiberna)
- Ou use cron job para manter ativo

### SQLite não funciona em produção

**Causa:** Sistema de arquivos efêmero em containers

**Solução:**
- Use PostgreSQL (Railway oferece grátis)
- Ou migre para Supabase

---

## 📚 Recursos

- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)

---

## 🎯 Resumo TLDR

```bash
# 1. Backend → Railway
# 2. Frontend → Netlify  
# 3. Conectar via variável de ambiente
# 4. Profit! 🚀
```

**Escolha Railway para o backend** - é o mais fácil e rápido!
