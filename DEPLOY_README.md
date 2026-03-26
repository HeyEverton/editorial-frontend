# Resumo: Deploy na Netlify

## 🎯 Resposta Direta

**A Netlify só hospeda frontend.** Você precisa hospedar o backend em outro lugar.

## ✅ O que eu fiz por você:

1. ✅ Criei arquivo `netlify.toml` (configuração da Netlify)
2. ✅ Criei arquivo `railway.json` (para hospedar backend grátis)
3. ✅ Atualizei `authService.ts` para usar variável de ambiente
4. ✅ Configurei CORS no backend para aceitar Netlify
5. ✅ Criei 3 guias de deploy (DEPLOY_NETLIFY.md, DEPLOY_CHECKLIST.md)

## 🚀 Solução Recomendada

**Frontend (Netlify) + Backend (Railway)**

### Por quê?
- ✅ Ambos são **GRÁTIS**
- ✅ Deploy automático do GitHub
- ✅ Simples e rápido
- ✅ Nenhuma alteração de código necessária*

*Já fiz as alterações necessárias para você!

## 📝 Próximos Passos (15 minutos)

### 1. Backend no Railway
1. Acesse https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione pasta `server/`
5. Adicione variáveis:
   - `JWT_SECRET` = qualquer_senha_forte_123
   - `FRONTEND_URL` = deixe em branco por enquanto
6. Anote a URL gerada (ex: `https://seuapp.up.railway.app`)

### 2. Frontend na Netlify
1. Acesse https://app.netlify.com  
2. "Add new site" → GitHub
3. Configurações:
   - Build: `npm run build`
   - Publish: `dist`
   - Variável: `VITE_API_URL` = `https://seuapp.up.railway.app/api`
4. Deploy!
5. Anote a URL (ex: `https://seusite.netlify.app`)

### 3. Volte ao Railway
1. Edite variável `FRONTEND_URL`
2. Cole a URL da Netlify
3. Pronto! ✅

## 📚 Documentação Criada

| Arquivo | Conteúdo |
|---------|----------|
| `DEPLOY_NETLIFY.md` | Guia completo com 3 opções |
| `DEPLOY_CHECKLIST.md` | Passo a passo rápido |
| `netlify.toml` | Config Netlify (já pronto) |
| `server/railway.json` | Config Railway (já pronto) |

## 💡 Alternativas

Se não quiser usar Railway, veja `DEPLOY_NETLIFY.md` para:
- **Render** (outra opção gratuita)
- **Netlify Functions** (serverless)
- **Supabase/Firebase** (BaaS)

## 🆘 Precisa de Ajuda?

Consulte `DEPLOY_CHECKLIST.md` para um guia visual passo a passo!
