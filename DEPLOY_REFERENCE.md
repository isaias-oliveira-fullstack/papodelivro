# 📚 Referência Rápida: Deploy Vercel

## URLs de Produção
- **Front-End**: https://papodelivro.vercel.app
- **Back-End/API**: https://papodelivro-api.vercel.app/api
- **Health Check**: https://papodelivro-api.vercel.app/health-check

## Comandos Úteis

### Desenvolvimento
```bash
# Back-end
cd server
npm run dev          # Roda com nodemon

# Front-end
cd client
npm run dev          # Roda com Vite
```

### Build Local
```bash
# Back-end
cd server
npm run build        # Compila TypeScript

# Front-end
cd client
npm run build        # Build para produção
```

### Deploy
```bash
git add .
git commit -m "seu-commit-aqui"
git push origin main  # Vercel faz deploy automático
```

## Variáveis de Ambiente

### Back-End (server/.env.production)
```
DATABASE_URL=postgresql://...
JWT_SECRET=sua-chave-secreta
FRONTEND_URL=https://papodelivro.vercel.app
ALLOWED_ORIGINS=https://papodelivro.vercel.app
```

### Front-End (client/.env.production)
```
VITE_API_URL=https://papodelivro-api.vercel.app/api
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-publica
```

## Troubleshooting

| Problema | Solução |
|----------|---------|
| CORS error | Verificar `ALLOWED_ORIGINS` |
| Página branca | Verificar `VITE_API_URL` |
| 404 em rotas | Verificar Root Directory na Vercel |
| Build falha | Ver build logs na Vercel |

## Links Úteis
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase: https://supabase.com
- Docs Vercel: https://vercel.com/docs
- Docs Node/Express: https://expressjs.com
- Docs React: https://react.dev

## Contacts
- GitHub: https://github.com/seu-usuario
- Email: seu-email@gmail.com
