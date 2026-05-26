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

O **Papo de Livro** é uma plataforma social de resenhas de livros desenvolvida durante o **LAB Sprint (LAB 365)**, um evento prático de desenvolvimento **Frontend** com foco em construção de aplicações reais e aplicação de boas práticas de desenvolvimento.

Durante o **LAB Sprint**, o projeto foi evoluído com o uso de **TypeScript**, **React** e **Node.js**, com foco em organização de código, componentização e integração entre frontend e backend.

A aplicação utiliza tecnologias modernas como **Tailwind CSS**, **Shadcn/UI**, **Vite** e **Supabase**, proporcionando uma experiência de desenvolvimento próxima de cenários reais de mercado, incluindo consumo de **API**, autenticação e persistência de dados.

O objetivo do projeto foi simular uma plataforma social funcional para leitores, aplicando conceitos de arquitetura, escalabilidade e boas práticas de desenvolvimento Full Stack.

### A arquitetura do projeto é dividida em três partes:

1. **Backend (Node.js + Express + TypeScript)**
   Responsável pela API REST, autenticação JWT e regras de negócio.

2. **Frontend (React + TypeScript + Tailwind CSS)**
   Interface responsável pela interação com o usuário, incluindo:

   * Catálogo de livros
   * Sistema de resenhas
   * Favoritos
   * Avaliações
   * Busca dinâmica

3. **Banco de Dados (Supabase/PostgreSQL)**
   Responsável pelo armazenamento de:

   * Usuários
   * Livros
   * Resenhas
   * Favoritos
   * Avaliações

O objetivo do projeto é simular uma plataforma social moderna voltada
para leitores, aplicando boas práticas de desenvolvimento Full Stack,
tipagem forte com TypeScript e organização modular da aplicação.

## Preview

Interface da plataforma com:

* Catálogo de livros
* Sistema de avaliações com estrelas
* CRUD de resenhas
* Busca dinâmica de livros
* Favoritos personalizados
* Integração com API REST
* Interface com Tailwind CSS e Shadcn/UI
* Persistência de dados com Supabase

## Estrutura do projeto

```bash
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
├── .gitignore
├── README.md
├── package.json
└── LICENSE
```

## Tecnologias utilizadas

* **TypeScript** (tipagem forte)
* **React 18** (componentização e interface)
* **Node.js + Express** (API REST)
* **Tailwind CSS** (estilização moderna)
* **Shadcn/UI** (componentes de interface moderna) 
* **Vite** (build e desenvolvimento frontend)
* **Supabase/PostgreSQL** (persistência de dados)
* **JWT** (autenticação segura)
* **Axios** (requisições HTTP)

## Implementação com React, Tailwind CSS e Shadcn/UI

A interface do projeto foi construída utilizando componentes React
combinados com utilitários do **Tailwind CSS** e **Shadcn/UI**, garantindo uma UI
moderna, organizada e consistente.

### Card de Livro

```tsx
<Card className="bg-zinc-900 rounded-xl shadow-lg p-4">
  <img src={book.cover} alt={book.title} />

  <h2 className="text-lg font-semibold mt-2">
    {book.title}
  </h2>

  <p className="text-zinc-400">
    {book.author}
  </p>

  <Button
    className="
      bg-emerald-600
      hover:bg-emerald-700
      transition
      px-4
      py-2
      rounded-lg
    "
  >
    Ler Resumo
  </Button>
</Card>
```

### Busca Dinâmica

```tsx
<Input
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
```

### Sistema de Avaliação

```tsx
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
```

### Grid de Livros

```tsx
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4
  gap-4
">
```

### Estilização com Tailwind CSS

* **Espaçamentos:** p-4, gap-4, mb-4
* **Sombras:** shadow-lg
* **Bordas:** rounded-xl, border
* **Grid Layout:** grid-cols-1 md:grid-cols-2 lg:grid-cols-4
* **Transições:** transition hover:bg-emerald-700

## Como executar o projeto

### Clone o repositório

```bash
git clone https://github.com/isaias-oliveira-fullstack/papodelivro.git
```

### Entre na pasta do projeto

```bash
cd papodelivro
```

## Execute o Frontend

### Entre na pasta do client

```bash
cd client
```

### Instale as dependências

```bash
npm install
```

### Crie o arquivo `.env`

```env
VITE_API_URL=http://localhost:3333
```

### Execute o projeto

```bash
npm run dev
```

Abra no navegador o endereço indicado pelo Vite
(geralmente `http://localhost:5173`).

## Execute o Backend

### Entre na pasta do server

```bash
cd server
```

### Instale as dependências

```bash
npm install
```

### Crie o arquivo `.env`

```env
PORT=3333
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
JWT_SECRET=your_secret
```

### Execute o servidor

```bash
npm run dev
```

Backend disponível em:

```bash
http://localhost:3333
```

## Aprendizados

Durante o desenvolvimento desta atividade foi possível praticar:

* Tipagem forte utilizando TypeScript
* Integração frontend/backend
* Estilização com Tailwind CSS
* Consumo de APIs REST
* CRUD completo
* Integração com Supabase
* Autenticação JWT
* Organização de projetos React e Node.js
* Arquitetura modular
* Clean Code

## Resultado

A utilização de React junto ao Tailwind CSS permitiu criar uma interface
mais moderna e interativa, mantendo organização estrutural,
reutilização de componentes e boa experiência do usuário.

A aplicação evoluiu para uma plataforma social completa voltada para
leitores e compartilhamento de resenhas.

## Deploy

O projeto pode ser publicado utilizando:

- **Vercel (Frontend):** https://papodelivro.vercel.app
- **Vercel Serverless Functions (Backend):** https://papodelivro-backend.vercel.app

> Não é necessário instalação após publicação - basta acessar o link.

## Contribuição

Se quiser contribuir com feedback ou sugestões, fique à vontade para abrir uma **[Issue](https://github.com/isaias-oliveira-fullstack/papodelivro/issues)** ou **[enviar ideias](https://github.com/isaias-oliveira-fullstack/papodelivro/pulls)**. 

## Licença

Este projeto está licenciado sob a **Licença MIT**.

Veja o arquivo **[LICENSE](./LICENSE)** para mais detalhes.

## Autor

Projeto desenvolvido por **Isaias Oliveira**.  
Conecte-se comigo no **[in/isaias-oliveira-dev](https://www.linkedin.com/in/isaias-oliveira-dev/)**

## Considerações Finais

O **LAB Sprint (LAB 365)** foi uma experiência prática que estimulou a tomada de decisões, a organização de código e a evolução constante durante o desenvolvimento do projeto, onde o desafio foi transformar ideias em uma aplicação funcional em pouco tempo, lidando com escolhas técnicas e aprendizados ao longo do processo.

> Esse tipo de iniciativa reforça a importância de consistência, adaptação e mentalidade de construção contínua no desenvolvimento de software.
