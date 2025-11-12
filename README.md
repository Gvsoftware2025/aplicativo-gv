# GV Admin - Sistema Administrativo PWA

Sistema standalone para gerenciar projetos do seu portfólio.

## Características
- ✅ PWA (Progressive Web App) - Instalável no celular
- ✅ Funciona offline
- ✅ Gerenciamento completo de projetos
- ✅ Upload de múltiplas imagens
- ✅ Estatísticas do site

## Como usar

### 1. Instalar dependências
\`\`\`bash
npm install
\`\`\`

### 2. Configurar variáveis de ambiente
Crie o arquivo `.env.local` com suas credenciais do Supabase:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
\`\`\`

### 3. Rodar localmente
\`\`\`bash
npm run dev
\`\`\`
Acesse: http://localhost:3000

### 4. Fazer login
Senha padrão: `GVAdmin!1530`

### 5. Deploy no Vercel
\`\`\`bash
# Subir pro GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main

# Deploy no Vercel
# 1. Acesse vercel.com
# 2. Importe o repositório
# 3. Adicione as variáveis de ambiente
# 4. Deploy!
\`\`\`

## Funcionalidades

### Dashboard
- Visão geral do sistema
- Status online/offline
- Acesso rápido às seções

### Projetos
- Criar/Editar/Deletar projetos
- Upload de até 10 imagens por projeto
- Adicionar tecnologias e funcionalidades
- Status do projeto (Planejamento/Em Desenvolvimento/Concluído)

### Estatísticas
- Atualizar números do site
- Projetos finalizados
- Clientes satisfeitos

## Senha
A senha está em `lib/pwa/auth.ts` linha 1:
\`\`\`typescript
const ADMIN_PASSWORD = "GVAdmin!1530"
\`\`\`

Para mudar, edite esse arquivo e faça rebuild.
