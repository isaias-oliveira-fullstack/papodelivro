# Papo de Livro – Frontend

Frontend da plataforma **Papo de Livro**, desenvolvido utilizando **React, TypeScript e Tailwind CSS**.

A aplicação é responsável pela interface da plataforma, permitindo que usuários naveguem pelo catálogo de livros, publiquem resenhas, realizem avaliações, adicionem favoritos e interajam com os conteúdos da aplicação através de uma experiência moderna e dinâmica.

O projeto foi estruturado utilizando boas práticas de componentização, organização modular e integração com API REST, simulando uma aplicação frontend moderna e escalável.

## Tecnologias Utilizadas

* React 18
* TypeScript
* Tailwind CSS
* Vite
* React Router DOM
* Axios
* Supabase
* Context API

## Estrutura de Pastas

```bash id="3o0f5h"
papodelivro/client/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Integração com API
│   ├── routes/          # Rotas da aplicação
│   ├── hooks/           # Hooks personalizados
│   ├── contexts/        # Gerenciamento de contexto
│   ├── types/           # Tipagens TypeScript
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Inicialização da aplicação
│
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env
```

## Funcionalidades da Aplicação

### Livros

* Listar livros
* Visualizar detalhes dos livros
* Buscar livros por título
* Navegar pelas categorias

### Resenhas

* Criar resenhas
* Editar resenhas
* Excluir resenhas
* Visualizar resenhas de usuários

### Avaliações

* Avaliar livros com estrelas
* Visualizar média de avaliações
* Exibir avaliações por livro

### Favoritos

* Adicionar livros aos favoritos
* Remover favoritos
* Listar favoritos do usuário

### Usuários

* Cadastro de usuários
* Login com autenticação JWT
* Controle de autenticação
* Rotas privadas

## Interface da Aplicação

A interface foi construída utilizando componentes React combinados com utilitários do Tailwind CSS para garantir uma aplicação organizada, moderna e consistente.

### Card de Livro

```tsx id="v7lz6w"
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
```

### Busca Dinâmica

```tsx id="26c35z"
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
```

### Sistema de Avaliação

```tsx id="esj93t"
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

## Integração com API

O frontend consome a API REST do projeto para gerenciamento de:

* Usuários
* Livros
* Resenhas
* Favoritos
* Avaliações

Backend disponível em:

```bash id="gwn0jq"
https://papodelivro-backend.vercel.app
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env id="qbqswq"
VITE_API_URL=your_url_api

VITE_SUPABASE_URL=your_url

VITE_SUPABASE_KEY=your_key
```

## Rodando Localmente

### 1. Clone o repositório

```bash id="uzn2wa"
git clone https://github.com/isaias-oliveira-fullstack/papodelivro.git
```

### 2. Entre na pasta do frontend

```bash id="xg02l9"
cd papodelivro/client
```

### 3. Instale as dependências

```bash id="lsyhrg"
npm install
```

### 4. Execute a aplicação

```bash id="7x2fj4"
npm run dev
```

Frontend disponível em:

```bash id="cfu0g2"
http://localhost:5173
```

## Observações

* Interface construída com React e Tailwind CSS
* Código totalmente tipado com TypeScript
* Estrutura modular e escalável
* Integração completa com backend Node.js
* Organização baseada em componentes e serviços
* Pronto para deploy com Vercel

## Aprendizados

Durante o desenvolvimento deste frontend foi possível praticar:

* Componentização com React
* Organização modular de aplicações frontend
* TypeScript no frontend
* Integração com APIs REST
* Gerenciamento de autenticação
* Context API
* Tailwind CSS
* Consumo de APIs com Axios
* Estruturação de aplicações escaláveis
* Deploy com Vercel

## Deploy

O frontend pode ser publicado utilizando:

* Vercel
* Netlify
* GitHub Pages

Deploy atual da aplicação:

* **Vercel (Frontend):** https://papodelivro.vercel.app

> Não é necessário instalação após publicação — basta acessar o link.

## Contribuição

Se quiser contribuir com feedback ou sugestões, fique à vontade para abrir uma **[Issue](https://github.com/isaias-oliveira-fullstack/papodelivro/issues)** ou **[enviar ideias](https://github.com/isaias-oliveira-fullstack/papodelivro/pulls)**. 

## Licença

Este projeto está licenciado sob a **Licença MIT**.

Veja o arquivo **[LICENSE](../LICENSE)** para mais detalhes.

## Autor

Projeto desenvolvido por **Isaias Oliveira**.  
Conecte-se comigo no **[in/isaias-oliveira-dev](https://www.linkedin.com/in/isaias-oliveira-dev/)**
