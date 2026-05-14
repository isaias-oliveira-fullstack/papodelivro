# 🎯 Guia Passo a Passo: Deploy Vercel (Visão Geral)

## 🔄 Fluxo Completo de Deploy

```
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 1: Preparação Local (Seu Computador)                     │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Criar arquivos .env.local (desenvolvimento)                   │
│ ✓ Criar arquivos .env.production (produção)                     │
│ ✓ Configurar CORS no server/src/app.ts                          │
│ ✓ Adicionar vercel.json em client/ e server/                    │
│ ✓ Testar localmente (npm run dev)                               │
│ ✓ Commit: git add . && git commit -m "chore: setup vercel"      │
└─────────────────────────────────────────────────────────────────┘
                            ⬇
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 2: GitHub (Versionamento)                                │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Criar repositório em GitHub                                   │
│ ✓ git remote add origin https://...                             │
│ ✓ git push -u origin main                                       │
│ ✓ Verificar se código está sincronizado                         │
└─────────────────────────────────────────────────────────────────┘
                            ⬇
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 3: Vercel - Back-End (API)                               │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Acessar vercel.com/dashboard                                  │
│ ✓ New Project → Selecionar repositório GitHub                   │
│ ✓ Root Directory: server                                        │
│ ✓ Build: npm run build                                          │
│ ✓ Adicionar Environment Variables:                              │
│   - DATABASE_URL                                                │
│   - JWT_SECRET                                                  │
│   - SUPABASE_URL, SUPABASE_KEY                                  │
│   - FRONTEND_URL (deixar em branco por enquanto)                │
│ ✓ Deploy                                                        │
│ ✓ Copiar URL: https://seu-backend.vercel.app                  │
└─────────────────────────────────────────────────────────────────┘
                            ⬇
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 4: Vercel - Front-End (React)                            │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Vercel Dashboard → New Project                                │
│ ✓ Root Directory: client                                        │
│ ✓ Framework: Vite                                               │
│ ✓ Build: npm run build                                          │
│ ✓ Adicionar Environment Variables:                              │
│   - VITE_API_URL=https://seu-backend.vercel.app/api             │
│   - VITE_SUPABASE_URL                                           │
│   - VITE_SUPABASE_KEY                                           │
│ ✓ Deploy                                                        │
│ ✓ Copiar URL: https://seu-frontend.vercel.app                 │
└─────────────────────────────────────────────────────────────────┘
                            ⬇
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 5: Configurar CORS em Produção                           │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Voltar ao projeto Back-End na Vercel                          │
│ ✓ Settings → Environment Variables                              │
│ ✓ Adicionar: FRONTEND_URL=https://seu-frontend.vercel.app       │
│ ✓ Adicionar: ALLOWED_ORIGINS=https://seu-frontend.vercel.app    │
│ ✓ Deploy automático (novo push)                                 │
└─────────────────────────────────────────────────────────────────┘
                            ⬇
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 6: Testes Finais                                          │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Abrir front-end no navegador                                  │
│ ✓ Verificar se carrega sem erros CORS                           │
│ ✓ Testar login                                                  │
│ ✓ Testar requisições autenticadas                               │
│ ✓ Verificar health-check da API                                 │
│ ✓ Testar múltiplos navegadores                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Checklist Rápido

### Antes de Fazer Push
```bash
# 1. Testar localmente
npm run dev

# 2. Checar TypeScript
npm run typecheck

# 3. Checar se não há erros
npm run lint

# 4. Fazer commit
git add .
git commit -m "feat: descrição do que foi feito"

# 5. Push
git push origin main
```

### Acompanhar Deploy
1. Acessar https://vercel.com/dashboard
2. Clicar no projeto
3. Ir em "Deployments"
4. Acompanhar o deploy em tempo real
5. Se falhar, clicar em "View Logs"

## 🔧 Arquivos Críticos a Verificar

| Arquivo | Verificar | Status |
|---------|-----------|--------|
| `server/.env.production` | Todas as variáveis setadas | ⚠️ |
| `client/.env.production` | `VITE_API_URL` correto | ⚠️ |
| `server/vercel.json` | `src` e `dest` | ✅ |
| `client/vercel.json` | `outputDirectory: dist` | ✅ |
| `server/src/app.ts` | CORS configurado | ✅ |
| `server/package.json` | Scripts corretos | ✅ |
| `client/package.json` | Scripts build | ✅ |

## 🚨 Erros Mais Comuns no Deploy

### ❌ CORS Error (Front-End)
**Mensagem**: `Access to XMLHttpRequest blocked by CORS policy`
**Solução**:
1. Verificar `ALLOWED_ORIGINS` no back-end
2. Certificar que `FRONTEND_URL` está correto
3. Fazer novo deploy do back-end

### ❌ 404 Not Found
**Mensagem**: `Cannot GET /api/books`
**Solução**:
1. Verificar se `vercel.json` está em `server/` e `client/`
2. Verificar Root Directory na Vercel
3. Verificar se rotas estão definidas em `server/routes`

### ❌ 500 Internal Server Error
**Mensagem**: `Internal Server Error`
**Solução**:
1. Verificar Runtime Logs na Vercel
2. Verificar variáveis de ambiente (DATABASE_URL)
3. Testar conexão com Supabase

### ❌ Página Branca no Front-End
**Mensagem**: Nada aparece
**Solução**:
1. Abrir DevTools (F12)
2. Verificar Console (erros?)
3. Verificar Network (requisições?)
4. Verificar se `VITE_API_URL` está correto

## ✅ Validação Final

```javascript
// Abrir console no navegador e executar:

// 1. Verificar URL da API
console.log('API URL:', import.meta.env.VITE_API_URL);

// 2. Testar conexão
fetch(import.meta.env.VITE_API_URL.replace('/api', '') + '/health-check')
  .then(r => r.json())
  .then(d => console.log('✅ API OK:', d))
  .catch(e => console.error('❌ API Erro:', e));

// 3. Testar CORS
fetch(import.meta.env.VITE_API_URL + '/books')
  .then(r => console.log('✅ Status:', r.status))
  .catch(e => console.error('❌ CORS Error:', e));
```

## 📞 Suporte

Se algo não funcionar:

1. **Verificar Logs**:
   - Vercel Dashboard → Projeto → Deployments → Logs

2. **Testar Localmente**:
   - `npm run dev` em ambas as pastas
   - Fazer requisi ções manualmente

3. **Resetar Variáveis**:
   - Deletar projeto na Vercel
   - Recriar do zero

4. **Limpar Cache**:
   - Ctrl+Shift+Del (Hard Refresh)
   - Verificar Incognito do navegador

---

**Última atualização**: 13 de maio de 2026
