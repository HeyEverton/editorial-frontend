# 🚀 Deploy Rápido - Checklist

## Pré-requisitos
- [ ] Código commitado no GitHub
- [ ] Conta no Railway (https://railway.app)
- [ ] Conta na Netlify (https://netlify.com)

## 1️⃣ Deploy do Backend (Railway)

1. **Acesse Railway:**
   - https://railway.app/
   - Login com GitHub

2. **Novo Projeto:**
   - "New Project" → "Deploy from GitHub repo"
   - Selecione seu repositório
   - Escolha a pasta `server/`

3. **Variáveis de Ambiente:**
   ```
   JWT_SECRET=minha_chave_super_secreta_123
   FRONTEND_URL=https://seu-site.netlify.app
   ```
   (Você vai pegar a URL da Netlify depois e voltar aqui para atualizar)

4. **Deploy!**
   - Railway fará deploy automaticamente
   - Anote a URL gerada (ex: `https://saaslucas-production.up.railway.app`)

## 2️⃣ Deploy do Frontend (Netlify)

1. **Acesse Netlify:**
   - https://app.netlify.com/
   - Login com GitHub

2. **Novo Site:**
   - "Add new site" → "Import an existing project"
   - Conecte GitHub
   - Selecione seu repositório

3. **Configurações de Build:**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Variáveis de Ambiente:**
   ```
   VITE_API_URL=https://SUA-URL-DO-RAILWAY.up.railway.app/api
   ```
   (Cole a URL que você anotou no passo 1)

5. **Deploy!**
   - Netlify fará deploy automaticamente
   - Anote a URL gerada (ex: `https://seu-site.netlify.app`)

## 3️⃣ Configuração Final

1. **Volte ao Railway:**
   - Edite variável `FRONTEND_URL`
   - Cole a URL da Netlify: `https://seu-site.netlify.app`
   - Salve (Railway fará redeploy automático)

2. **Teste:**
   - Abra sua URL da Netlify
   - Tente fazer login com: `editor@elite.com` / `senha123`
   - ✅ Deve funcionar!

## 🆘 Problemas?

### Erro de CORS
- Verifique se `FRONTEND_URL` no Railway está correto
- Deve ser exatamente a URL da Netlify (sem barra no final)

### "Network Error"
- Verifique se `VITE_API_URL` na Netlify está correto
- Deve terminar com `/api`
- Exemplo: `https://saaslucas.up.railway.app/api`

### Backend não responde
- Aguarde 30s (Railway pode estar iniciando)
- Verifique logs no Railway Dashboard

## ✅ Pronto!

Seu sistema está no ar! 🎉

**URLs:**
- Frontend: https://seu-site.netlify.app
- Backend: https://seu-backend.up.railway.app

**Usuário de teste:**
- Email: editor@elite.com
- Senha: senha123
