````md
# Papo de Livro - Plataforma Social de Resenhas de Livros

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Descrição do projeto

Este projeto implementa uma **plataforma social de resenhas de livros**
utilizando **TypeScript, React e Node.js**.

A aplicação foi evoluída com o uso de **Tailwind CSS**, **Vite** e
**Supabase**, proporcionando uma interface moderna, responsiva e mais
próxima de aplicações reais.

A arquitetura do projeto é dividida em três partes:

1. **Backend (Node.js + Express + TypeScript)**\
   Responsável pela API REST, autenticação JWT e regras de negócio.

2. **Frontend (React + TypeScript + Tailwind CSS)**\
   Interface responsável pela interação com o usuário, incluindo:

   - Catálogo de livros
   - Sistema de resenhas
   - Favoritos
   - Avaliações
   - Busca dinâmica
   - Layout responsivo

3. **Banco de Dados (Supabase/PostgreSQL)**\
   Responsável pelo armazenamento de:

   - Usuários
   - Livros
   - Resenhas
   - Favoritos
   - Avaliações

O objetivo é simular uma plataforma social moderna para leitores,
aplicando boas práticas de organização, tipagem e construção de
interfaces modernas.

## Preview

Interface da plataforma com:

- Catálogo responsivo de livros
- Sistema de avaliações com estrelas
- CRUD de resenhas
- Busca dinâmica de livros
- Favoritos personalizados
- Integração com API REST
- Layout responsivo com Tailwind CSS
- Persistência de dados com Supabase

## Estrutura do projeto

\```bash
papodelivro/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/
├── .gitignore
├── README.md
├── package.json
└── LICENSE
\```

## Tecnologias utilizadas

- **TypeScript** (tipagem forte, sem `any`)
- **React 18** (componentização e gerenciamento de interface)
- **Node.js + Express** (API REST)
- **Tailwind CSS** (responsividade e estilização moderna)
- **Vite** (build e desenvolvimento frontend)
- **Supabase/PostgreSQL** (persistência de dados)
- **JWT** (autenticação segura)
- **Axios** (requisições HTTP)

## Implementação com React & Tailwind CSS

A interface do projeto foi construída utilizando componentes React
combinados com utilitários do **Tailwind CSS**, garantindo uma UI
moderna, responsiva e consistente.

### Card de Livro

\```tsx
<div className="bg-zinc-900 rounded-xl shadow-lg p-4">
  <img src={book.cover} alt={book.title} />

  <h2 className="text-lg font-semibold mt-2">
    {book.title}
  </h2>

  <p className="text-zinc-400">
    {book.author}
  </p>

  <button
    className="
      bg-emerald-600
      hover:bg-emerald-700
      transition
      px-4
      py-2
      rounded-lg
    "
  >
    Ver detalhes
  </button>
</div>
\```

### Busca Dinâmica

\```tsx
<input
  type="text"
  placeholder="Buscar livros..."
  className="
    w-full
    p-3
    rounded-lg
    border
    border-zinc-700
    bg-zinc-900
  "
/>
\```

### Sistema de Avaliação

\```tsx
<div className="flex gap-1">
  {Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={
        index < rating
          ? "fill-yellow-400"
          : "fill-zinc-700"
      }
    />
  ))}
</div>
\```

### Responsividade com Tailwind CSS

\```tsx
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4
  gap-4
">
\```

### Estilização com Tailwind CSS

- **Espaçamentos:** p-4, gap-4, mb-4
- **Sombras:** shadow-lg
- **Bordas:** rounded-xl, border
- **Responsividade:** grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- **Transições:** transition hover:bg-emerald-700

## Como executar o projeto

### Clone o repositório

\```bash
git clone https://github.com/isaias-oliveira-fullstack/papodelivro.git
\```

### Entre na pasta do projeto

\```bash
cd papodelivro
\```

## Execute o Frontend

### Entre na pasta do client

\```bash
cd client
\```

### Instale as dependências

\```bash
npm install
\```

### Crie o arquivo `.env`

\```env
VITE_API_URL=http://localhost:3333
\```

### Execute o projeto

\```bash
npm run dev
\```

Abra no navegador o endereço indicado pelo Vite
(geralmente `http://localhost:5173`).

## Execute o Backend

### Entre na pasta do server

\```bash
cd server
\```

### Instale as dependências

\```bash
npm install
\```

### Crie o arquivo `.env`

\```env
PORT=3333
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
JWT_SECRET=your_secret
\```

### Execute o servidor

\```bash
npm run dev
\```

Backend disponível em:

\```bash
http://localhost:3333
\```

## Aprendizados

Durante o desenvolvimento desta atividade foi possível praticar:

- Tipagem forte utilizando TypeScript
- Integração frontend/backend
- Estilização com Tailwind CSS
- Responsividade com grid
- Consumo de APIs REST
- CRUD completo
- Integração com Supabase
- Autenticação JWT
- Organização de projetos React e Node.js
- Arquitetura modular
- Clean Code

## Resultado

A utilização de React junto ao Tailwind CSS permitiu criar uma interface
mais moderna, interativa e responsiva, mantendo organização estrutural,
reutilização de componentes e boa experiência do usuário.

A aplicação evoluiu para uma plataforma social completa voltada para
leitores e compartilhamento de resenhas.

## Deploy

O projeto pode ser publicado utilizando:

- Vercel (Frontend)
- Vercel Serverless Functions (Backend)

> Não é necessário instalação após publicação — basta acessar o link.

## Contribuição

Se quiser contribuir com feedback ou sugestões, fique à vontade para abrir uma **[Issue](https://github.com/isaias-oliveira-fullstack/papodelivro/issues)** ou **[enviar ideias](https://github.com/isaias-oliveira-fullstack/papodelivro/pulls)**. 

## Licença

Este projeto está licenciado sob a **Licença MIT**.

Veja o arquivo **[LICENSE](./LICENSE)** para mais detalhes.

## Autor

Projeto desenvolvido por **Isaias Oliveira**.  
Conecte-se comigo no **[in/isaias-oliveira-dev](https://www.linkedin.com/in/isaias-oliveira-dev/)**
````
