# Sistema de Autenticação - Editorial Architect 🔐

Sistema completo de login e autenticação com:
- ✅ Tela de login minimalista (design exato da imagem fornecida)
- ✅ Backend Node.js + Express com autenticação JWT
- ✅ Banco de dados SQLite
- ✅ Hash de senhas com bcrypt
- ✅ Proteção de rotas no frontend

## 📋 Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

## 🚀 Instalação

### 1. Instalar Dependências do Frontend

```powershell
# Navegue até a pasta do projeto
cd c:\projetos\saaslucas

# Instale as dependências
npm install
```

### 2. Instalar Dependências do Backend

```powershell
# Navegue até a pasta do servidor
cd c:\projetos\saaslucas\server

# Instale as dependências
npm install
```

**Importante:** Se o PowerShell bloquear a execução de scripts, execute este comando como Administrador:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## ▶️ Como Executar

### 1. Iniciar o Backend (Servidor de Autenticação)

```powershell
# Terminal 1 - Na pasta server
cd c:\projetos\saaslucas\server
npm start
```

O servidor estará rodando em **http://localhost:3001**

Você verá uma mensagem como:
```
✅ Conectado ao banco de dados SQLite
✅ Tabela "usuarios" criada/verificada com sucesso
✅ Usuário padrão criado:
   Email: editor@elite.com
   Senha: senha123

🚀 Servidor rodando na porta 3001
```

### 2. Iniciar o Frontend

```powershell
# Terminal 2 - Na pasta raiz do projeto
cd c:\projetos\saaslucas
npm run dev
```

O frontend estará rodando em **http://localhost:5173** (ou outra porta indicada)

## 🔑 Credenciais de Teste

Use estas credenciais para fazer login:

- **Email:** `editor@elite.com`
- **Senha:** `senha123`

## 🎨 Funcionalidades

### Tela de Login
- Design minimalista e elegante exatamente como na imagem
- Validação de formulário em tempo real
- Estados de loading durante autenticação
- Mensagens de erro e sucesso

### Backend
- **POST /api/auth/register** - Registrar novo usuário
- **POST /api/auth/login** - Fazer login (retorna token JWT)
- **GET /api/auth/verify** - Verificar token válido (rota protegida)

### Banco de Dados
- SQLite (arquivo `database.sqlite` criado automaticamente)
- Tabela `usuarios` com campos:
  - id, email, senha_hash, nome, created_at, updated_at

### Segurança
- Senhas hasheadas com bcrypt (10 salt rounds)
- Tokens JWT com validade de 7 dias
- Middleware de autenticação para rotas protegidas
- Validação de entrada no backend

## 📁 Estrutura do Projeto

```
c:\projetos\saaslucas\
├── components/
│   ├── Login.tsx              # Componente de login
│   ├── Login.module.css       # Estilos do login
│   ├── Dashboard.tsx          # Página protegida (exemplo)
│   └── ProtectedRoute.tsx     # HOC para proteção de rotas
├── services/
│   └── authService.ts         # Serviço de autenticação
├── server/
│   ├── server.js              # Servidor Express principal
│   ├── database.js            # Configuração SQLite
│   ├── controllers/
│   │   └── auth.controller.js # Lógica de autenticação
│   ├── middleware/
│   │   └── auth.middleware.js # Middleware JWT
│   ├── .env                   # Variáveis de ambiente
│   └── package.json
├── App.tsx                    # App com integração de login
└── package.json
```

## 🧪 Testando a API

Você pode testar a API diretamente:

### Login
```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"editor@elite.com","senha":"senha123"}'
```

### Registrar Novo Usuário
```powershell
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"novo@email.com","senha":"minhasenha123","nome":"Novo Usuario"}'
```

### Verificar Token
```powershell
curl -X GET http://localhost:3001/api/auth/verify `
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔧 Configuração (Opcional)

### Alterar Porta do Backend

Edite `server/.env`:
```
PORT=3001  # Mude para a porta desejada
```

### Alterar Secret do JWT

Edite `server/.env`:
```
JWT_SECRET=sua_chave_secreta_aqui  # Use uma chave forte em produção
```

## ❓ Solução de Problemas

### Erro: "Cannot find module 'axios'"
Execute `npm install` na pasta raiz do projeto

### Erro: "EADDRINUSE" (porta em uso)
- Feche outros processos usando a porta 3001
- Ou altere a porta no arquivo `.env`

### Banco de dados não é criado
- Verifique permissões de escrita na pasta `server/`
- O arquivo `database.sqlite` será criado automaticamente na primeira execução

### Tela em branco após login
- Verifique se o backend está rodando em http://localhost:3001
- Abra o console do navegador (F12) para ver erros

## 🎯 Próximos Passos

Agora você pode:
1. Personalizar a tela de login com sua marca
2. Adicionar mais campos ao formulário de registro
3. Implementar recuperação de senha
4. Adicionar mais rotas protegidas
5. Integrar com seu aplicativo existente

## 📝 Anotações Técnicas

- O token JWT é armazenado no `localStorage`
- O browser envia automaticamente o token em todas as requisições
- Logout limpa o token do `localStorage`
- SQLite é perfeito para desenvolvimento/projetos pequenos
- Para produção, considere PostgreSQL ou MySQL

---

**Desenvolvido com 🚀 por Antigravity AI**
