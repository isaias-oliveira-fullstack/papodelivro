# Guia de Implementação - Migração RLS para Supabase

## 📋 Status Atual

Seu projeto:
- ✅ Backend: Node.js/Express com `@supabase/supabase-js`
- ✅ Banco de dados: PostgreSQL via Supabase
- ❌ RLS: **DESATIVADO** (risco de segurança)

---

## ⚠️ O que vai acontecer quando aplicar a migração SQL

### **ANTES da migração (INSEGURO)**
- Qualquer pessoa pode ler `users.password` via API
- Qualquer usuário pode ver dados de outros usuários
- Sem controle por linha de dados

### **DEPOIS da migração (SEGURO)**
- Usuários só veem/editam seus próprios dados
- Senhas bloqueadas completamente
- Tokens de reset protegidos (admin/service_role only)

---

## 🔧 Passo 1: Verificar configuração do Supabase no Backend

Procure no seu código backend por:

```typescript
// Seu arquivo de configuração Supabase (algo como supabaseClient.ts, database.ts, etc)
import { createClient } from '@supabase/supabase-js';

// ❌ NÃO USE ISSO (não funciona com RLS ativado)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY  // ← Problema aqui!
);

// ✅ USE ISSO (funciona com RLS ativado)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ← Service role key
);
```

---

## 🚀 Passo 2: Adicionar `.env` do backend

Se você não tiver essas variáveis, adicione ao seu `.env` backend:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Copie do Supabase Dashboard
SUPABASE_ANON_KEY=eyJhbGc...           # Só para referência
```

> **⚠️ IMPORTANTE**: `SERVICE_ROLE_KEY` é como uma senha de admin. **Nunca exponha no frontend ou git!**

---

## 💾 Passo 3: Aplicar Migração SQL no Supabase Dashboard

1. Acesse: **https://app.supabase.com** → Seu Projeto
2. Vá em **SQL Editor** (menu esquerdo)
3. Clique em **New Query**
4. Cole o conteúdo do arquivo: `supabase_rls_security.sql`
5. Clique em **Run**
6. Aguarde a confirmação (deve aparecer "Success")

---

## ✅ Passo 4: Testar se está funcionando

Execute no seu backend:

```bash
npm run dev
```

Depois teste uma chamada simples:

```bash
curl http://localhost:3333/api/users
# Deve retornar: {"error": "Unauthorized"} ou dados vazio
# NÃO deve retornar todos os usuários com senhas visíveis
```

---

## 🔍 Verificar RLS Ativado no Supabase

No **SQL Editor** do Supabase, execute:

```sql
-- Verificar RLS ativado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'books', 'reviews', 'favorites', 'messages', 'summaries', 'password_reset_tokens', 'SequelizeMeta');
```

**Resultado esperado:**
```
tablename                | rowsecurity
------------------------+-----------
users                    | true
books                    | true
reviews                  | true
favorites                | true
messages                 | true
summaries                | true
password_reset_tokens    | true
SequelizeMeta           | true
```

Se algum está com `rowsecurity = false`, significa que RLS **não foi ativado** para essa tabela.

---

## 🛠️ Troubleshooting

### ❌ Erro: "Permission denied for schema public"
**Causa**: Você está usando `ANON_KEY` em vez de `SERVICE_ROLE_KEY`  
**Solução**: Atualize para usar `SERVICE_ROLE_KEY`

### ❌ Erro: "row level security policy" 
**Causa**: A política RLS está bloqueando a ação  
**Solução**: Verifique se seu backend está:
1. Usando `SERVICE_ROLE_KEY`, OU
2. Enviando JWT válido de Supabase Auth

### ❌ Backend continua funcionando normalmente (sem erros)
**Significa**: RLS ainda não foi ativado. Verifique se:
1. Você rodou o SQL no dashboard correto
2. O SQL executou sem erros
3. Você está no projeto Supabase correto

---

## 📝 Resumo: O que vai mudar no seu projeto

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Segurança** | Exposto publicamente | Protegido por RLS |
| **Coluna password** | Visível via API | Bloqueada completamente |
| **Acesso ao dados** | Qualquer um | Apenas proprietário + admin |
| **Tokens reset** | Acessível | Bloqueado (admin only) |

---

## ✨ Próximos passos

1. **Adicionar `SERVICE_ROLE_KEY` ao seu `.env` backend**
2. **Aplicar migração SQL no Supabase**
3. **Testar APIs do backend**
4. **Monitorer logs de erro** (alguns endpoints podem quebrar se não estavam preparados)

---

## 🎯 Endpoints que podem quebrar

Se você tiver endpoints como:

- `GET /api/users` - Agora só retorna o usuário autenticado
- `GET /api/users/:id` - Bloqueado se ID ≠ usuário autenticado
- `GET /api/reviews` - Bloqueado (só vê próprias reviews)
- `GET /api/password-reset-tokens` - Bloqueado completamente
- `GET /admin/users` - Funciona (se usar `SERVICE_ROLE_KEY`)

Verifique cada endpoint do seu backend e ajuste conforme necessário!

---

**Dúvidas?** Me avise o resultado de:
```bash
curl http://localhost:3333/api/health
# ou qualquer endpoint seguro do backend
```
