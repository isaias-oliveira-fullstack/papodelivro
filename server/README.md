# 🛠️ Papo de Livro – Backend

API RESTful para gerenciamento de usuários, livros, resenhas, favoritos e avaliações, parte do projeto **Papo de Livro**.

---

## 🧰 Tecnologias Utilizadas

- Node.js + Express
- TypeScript
- PostgreSQL (via Supabase)
- JWT para autenticação
- Swagger para documentação
- Postman para testes
- Jest + Supertest (testes automatizados)

---

## 📂 Estrutura de Pastas

papodelivro/server/  
├── src/  
│   ├── controllers/      # Lógica das rotas  
│   ├── models/           # Tipos e entidades (TypeScript)  
│   ├── routes/           # Definição das rotas  
│   ├── middlewares/      # Middlewares personalizados  
│   ├── config/           # Configurações gerais  
│   ├── database/         # Conexão com Supabase  
│   └── server.ts         # Inicialização do servidor  
├── tests/                # Testes com Jest/Supertest  
├── docs/                 # Coleção Postman  
├── swagger.ts            # Configuração Swagger  
└── .env  

---

## 🧠 Funcionalidades da API

### 📖 Livros
- Listar livros
- Buscar por título, autor ou gênero
- Exibir detalhes de um livro

### ✍️ Resenhas
- Criar resenha
- Listar resenhas por livro
- Excluir resenha

### ⭐ Avaliações
- Avaliar livros (1 a 5)
- Calcular média de avaliações

### ❤️ Favoritos
- Adicionar aos favoritos
- Listar favoritos do usuário

### 🔐 Usuários
- Cadastro e login
- Autenticação com JWT

---

## 🗄️ Supabase

Este projeto utiliza o Supabase como banco de dados PostgreSQL.

O backend estará disponível em:  
http://localhost:3333

---

## 🔐 Autenticação com JWT

- Após o login, o token JWT é retornado  
- Use o token no header para acessar rotas protegidas  

Authorization: Bearer <seu_token>

---

## 📄 Documentação Swagger

Acesse a documentação Swagger para visualizar e testar as rotas da API:

http://localhost:3333/api-docs

A documentação é gerada automaticamente a partir das rotas.

---

## 🧪 Testes Automatizados

Executar os testes:

npm test

Exemplos de testes:

- autenticação de usuário  
- criação de resenhas  
- rotas protegidas  
- integração com API  

---

## 📬 Coleção Postman

A coleção pronta para testes está disponível em:

./docs/PapoDeLivro-Backend.postman_collection.json

Inclui:

- Autenticação  
- CRUD de livros  
- Resenhas  
- Favoritos  
- Avaliações  

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

PORT=3333  
SUPABASE_URL=your_url  
SUPABASE_KEY=your_key  
JWT_SECRET=your_secret  

---

## ▶️ Rodando Localmente

### 1. Clone o repositório

git clone https://github.com/seu-repositorio/papodelivro.git  
cd papodelivro/server  

### 2. Instale as dependências

npm install  

### 3. Rode a aplicação

npm run dev  

---

### ✅ Pronto! Backend rodando.

---

## 📌 Observações

- API integrada com Supabase  
- Estrutura preparada para escalabilidade  
- Código tipado com TypeScript  
- Pronto para deploy na Vercel  

---

## 👨‍💻 Autor

Projeto desenvolvido por **Isaias Oliveira**

---

## 📄 Licença

Este projeto é de uso educacional.