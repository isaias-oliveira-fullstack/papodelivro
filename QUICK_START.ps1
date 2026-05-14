# 🚀 Quick Start: Deploy Vercel (Windows)
# Execute este script no PowerShell ou copie os comandos

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 VERCEL DEPLOY - QUICK START" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# PASSO 1: Testar Localmente
Write-Host "📝 PASSO 1: Testando Localmente..." -ForegroundColor Yellow
Write-Host "  Abra DOIS terminais PowerShell:" -ForegroundColor White
Write-Host ""
Write-Host "  📌 Terminal 1 (Back-end):" -ForegroundColor Green
Write-Host "     cd server" -ForegroundColor Gray
Write-Host "     npm install" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  📌 Terminal 2 (Front-end):" -ForegroundColor Green
Write-Host "     cd client" -ForegroundColor Gray
Write-Host "     npm install" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✓ Abra http://localhost:5173 no navegador" -ForegroundColor Green
Write-Host "  ✓ Teste se está funcionando" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER quando tudo estiver funcionando"

# PASSO 2: GitHub
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🐙 PASSO 2: Criando Repositório GitHub..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Abra https://github.com/new" -ForegroundColor Yellow
Write-Host "2️⃣  Crie um repositório chamado: papodelivro" -ForegroundColor Yellow
Write-Host ""
Write-Host "Depois, copie E EXECUTE os comandos abaixo:" -ForegroundColor White
Write-Host ""

$gitCommands = @(
    "git remote add origin https://github.com/SEU-USUARIO/papodelivro.git",
    "git add .",
    "git commit -m 'chore: preparar para deploy vercel'",
    "git branch -M main",
    "git push -u origin main"
)

foreach ($cmd in $gitCommands) {
    Write-Host "  > $cmd" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Pressione ENTER quando terminar o push para GitHub"

# PASSO 3: Vercel Back-End
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🔙 PASSO 3: Deploy Back-End" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Abra https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "2️⃣  Clique em 'New Project'" -ForegroundColor Yellow
Write-Host "3️⃣  Conecte seu repositório GitHub (papodelivro)" -ForegroundColor Yellow
Write-Host ""
Write-Host "4️⃣  Configuração do Projeto:" -ForegroundColor Yellow
Write-Host "    • Root Directory: server" -ForegroundColor Gray
Write-Host "    • Framework: Other (Node.js)" -ForegroundColor Gray
Write-Host "    • Build Command: npm run build" -ForegroundColor Gray
Write-Host "    • Output Directory: dist" -ForegroundColor Gray
Write-Host ""
Write-Host "5️⃣  Environment Variables (ADICIONE UMA POR UMA):" -ForegroundColor Yellow

$envVars = @(
    "DATABASE_URL = postgresql://postgres:password@db.supabase.co:5432/postgres",
    "JWT_SECRET = sua-chave-super-secreta-aqui",
    "SUPABASE_URL = https://seu-projeto.supabase.co",
    "SUPABASE_KEY = sua-chave-privada",
    "NODE_ENV = production"
)

foreach ($var in $envVars) {
    Write-Host "    • $var" -ForegroundColor Gray
}

Write-Host ""
Write-Host "6️⃣  Clique em 'Deploy'" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Copie a URL da API:" -ForegroundColor Green
Write-Host "   https://seu-backend-name.vercel.app" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione ENTER quando terminar"

# PASSO 4: Vercel Front-End
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎨 PASSO 4: Deploy Front-End" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Volte a https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "2️⃣  Clique em 'New Project'" -ForegroundColor Yellow
Write-Host "3️⃣  Selecione o MESMO repositório GitHub" -ForegroundColor Yellow
Write-Host ""
Write-Host "4️⃣  Configuração do Projeto:" -ForegroundColor Yellow
Write-Host "    • Root Directory: client" -ForegroundColor Gray
Write-Host "    • Framework: Vite" -ForegroundColor Gray
Write-Host "    • Build Command: npm run build" -ForegroundColor Gray
Write-Host "    • Output Directory: dist" -ForegroundColor Gray
Write-Host ""
Write-Host "5️⃣  Environment Variables:" -ForegroundColor Yellow

$envVarsFront = @(
    "VITE_API_URL = https://seu-backend-name.vercel.app/api",
    "VITE_SUPABASE_URL = https://seu-projeto.supabase.co",
    "VITE_SUPABASE_KEY = sua-chave-publica",
    "VITE_MODE = production"
)

foreach ($var in $envVarsFront) {
    Write-Host "    • $var" -ForegroundColor Gray
}

Write-Host ""
Write-Host "6️⃣  Clique em 'Deploy'" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Copie a URL do Front-end:" -ForegroundColor Green
Write-Host "   https://seu-frontend-name.vercel.app" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione ENTER quando terminar"

# PASSO 5: Reconfigurar CORS
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🔒 PASSO 5: Reconfigurar CORS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Volte ao projeto Back-End na Vercel" -ForegroundColor Yellow
Write-Host "2️⃣  Vá em Settings → Environment Variables" -ForegroundColor Yellow
Write-Host ""
Write-Host "3️⃣  Adicione/Atualize:" -ForegroundColor Yellow
Write-Host "    • FRONTEND_URL = https://seu-frontend-name.vercel.app" -ForegroundColor Gray
Write-Host "    • ALLOWED_ORIGINS = https://seu-frontend-name.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Vercel fará deploy automático" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER quando terminar"

# PASSO 6: Validar
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ PASSO 6: Validando" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Abra seu front-end em produção" -ForegroundColor Yellow
Write-Host "   https://seu-frontend-name.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "2️⃣  Abra DevTools (Pressione F12)" -ForegroundColor Yellow
Write-Host "3️⃣  Vá na aba Console" -ForegroundColor Yellow
Write-Host "4️⃣  Cole e execute:" -ForegroundColor Yellow
Write-Host ""

$jsCode = @"
// ✅ Testar API
fetch('https://seu-backend-name.vercel.app/health-check')
  .then(r => r.json())
  .then(d => console.log('✅ API OK:', d))
  .catch(e => console.error('❌ Erro:', e));

// ✅ Testar CORS
fetch('https://seu-backend-name.vercel.app/api/books')
  .then(r => console.log('✅ Status:', r.status))
  .catch(e => console.error('❌ CORS Error:', e));
"@

Write-Host $jsCode -ForegroundColor Gray
Write-Host ""

# FIM
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT COMPLETO!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs de Produção:" -ForegroundColor Yellow
Write-Host "  🌐 Front-end: https://seu-frontend-name.vercel.app" -ForegroundColor Cyan
Write-Host "  🔌 Back-end:  https://seu-backend-name.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Daqui em diante, qualquer 'git push' faz deploy automático!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentação disponível:" -ForegroundColor Yellow
Write-Host "   • README_DEPLOY.md - Guia completo e detalhado" -ForegroundColor White
Write-Host "   • DEPLOYMENT_FLOW.md - Fluxo visual passo a passo" -ForegroundColor White
Write-Host "   • DEPLOY_REFERENCE.md - Referência rápida" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Próximos passos opcionais:" -ForegroundColor Yellow
Write-Host "   • Configurar domínio personalizado" -ForegroundColor Gray
Write-Host "   • Ativar Vercel Analytics para monitoramento" -ForegroundColor Gray
Write-Host "   • Configurar CI/CD com testes automáticos" -ForegroundColor Gray
Write-Host "   • Backup automático do banco de dados (Supabase)" -ForegroundColor Gray
Write-Host ""
