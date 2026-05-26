# Papo de Livro – Backend

Backend da plataforma **Papo de Livro**, desenvolvido utilizando **Node.js, Express e TypeScript**.

A API REST é responsável pelo gerenciamento de usuários, livros, resenhas, favoritos e avaliações, além da autenticação segura com JWT e integração com Supabase/PostgreSQL.

O projeto foi estruturado utilizando boas práticas de organização modular, tipagem forte com TypeScript e separação de responsabilidades, simulando uma aplicação backend moderna e escalável.

## Tecnologias Utilizadas

* Node.js
* Express
* TypeScript
* PostgreSQL (Supabase)
* JWT Authentication
* Swagger
* Postman
* Jest
* Supertest

## Estrutura de Pastas

```bash id="abqf2d"
papodelivro/server/
├── src/
│   ├── controllers/      # Lógica das rotas
│   ├── routes/           # Definição das rotas
│   ├── middlewares/      # Middlewares personalizados
│   ├── services/         # Regras de negócio
│   ├── utils/            # Funções utilitárias
│   ├── types/            # Tipagens TypeScript
│   ├── config/           # Configurações gerais
│   ├── database/         # Integração com Supabase
│   └── server.ts         # Inicialização do servidor
│
├── tests/                # Testes automatizados
├── docs/                 # Coleção Postman
├── swagger.ts            # Configuração Swagger
├── package.json
├── tsconfig.json
└── .env
```

## Funcionalidades da API

### Livros

* Listar livros
* Buscar livros por título
* Buscar por autor ou gênero
* Exibir detalhes de um livro

### Resenhas

* Criar resenhas
* Editar resenhas
* Listar resenhas
* Excluir resenhas

### Avaliações

* Avaliar livros de 1 a 5 estrelas
* Calcular média de avaliações
* Exibir avaliações por livro

### Favoritos

* Adicionar livros aos favoritos
* Remover favoritos
* Listar favoritos do usuário

### Usuários

* Cadastro de usuários
* Login com autenticação JWT
* Proteção de rotas privadas

## Banco de Dados

O projeto utiliza o **Supabase** como banco de dados PostgreSQL para persistência das informações da plataforma.

Dados armazenados:

* Usuários
* Livros
* Resenhas
* Favoritos
* Avaliações

## Autenticação com JWT

Após o login, a API retorna um token JWT que deve ser utilizado nas rotas protegidas.

Exemplo:

```bash id="mrm8ic"
Authorization: Bearer <seu_token>
```

As rotas autenticadas utilizam middleware para validação do token e autorização do usuário.

## Documentação Swagger

A API possui documentação utilizando Swagger para facilitar testes e visualização das rotas disponíveis.

Documentação local:

```bash id="31k4ys"
http://localhost:3333/api-docs
```

Deploy da API:

```bash id="y1r42s"
https://papodelivro-backend.vercel.app
```

## Testes Automatizados

O projeto utiliza **Jest** e **Supertest** para testes automatizados da API.

Executar os testes:

```bash id="llw2jh"
npm test
```

Exemplos de testes implementados:

* autenticação de usuários
* rotas protegidas
* criação de resenhas
* integração com API
* validação de endpoints

## Coleção Postman

A coleção Postman está disponível na pasta:

```bash id="h6s7bk"
./docs/PapoDeLivro-Backend.postman_collection.json
```

Inclui testes para:

* autenticação
* livros
* resenhas
* favoritos
* avaliações

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env id="i9z01l"
PORT=3333

SUPABASE_URL=your_url

SUPABASE_KEY=your_key

JWT_SECRET=your_secret
```

## Rodando Localmente

### 1. Clone o repositório

```bash id="4n0lhx"
git clone https://github.com/isaias-oliveira-fullstack/papodelivro.git
```

### 2. Entre na pasta do backend

```bash id="8c2dxw"
cd papodelivro/server
```

---

### 3. Instale as dependências

```bash id="shy3w5"
npm install
```

### 4. Execute a aplicação

```bash id="d3g8v2"
npm run dev
```

## Observações

* API integrada com Supabase
* Código totalmente tipado com TypeScript
* Estrutura modular e escalável
* Integração completa com frontend React
* Pronto para deploy em ambiente serverless
* Organização baseada em controllers, services e middlewares

## Aprendizados

Durante o desenvolvimento deste backend foi possível praticar:

* Construção de APIs REST
* Organização modular de projetos Node.js
* TypeScript no backend
* Integração com PostgreSQL
* Supabase
* JWT Authentication
* Middlewares personalizados
* Testes automatizados
* Swagger
* Estruturação de aplicações escaláveis
* Deploy com Vercel

## Deploy

O backend pode ser publicado utilizando:

* Vercel Serverless Functions
* Node.js Hosting
* Render
* Railway

- **Vercel Serverless Functions (Backend):** https://papodelivro-backend.vercel.app

> Não é necessário instalação após publicação — basta acessar o link.

## Contribuição

Se quiser contribuir com feedback ou sugestões, fique à vontade para abrir uma **[Issue](https://github.com/isaias-oliveira-fullstack/papodelivro/issues)** ou **[enviar ideias](https://github.com/isaias-oliveira-fullstack/papodelivro/pulls)**. 

## Licença

Este projeto está licenciado sob a **Licença MIT**.

Veja o arquivo **[LICENSE](../LICENSE)** para mais detalhes.

## Autor

Projeto desenvolvido por **Isaias Oliveira**.  
Conecte-se comigo no **[in/isaias-oliveira-dev](https://www.linkedin.com/in/isaias-oliveira-dev/)**
