# API Timeline

API para gerenciamento de timelines de projetos, desenvolvida com NestJS, Prisma e MongoDB.

## Visão Geral

A API Timeline é uma solução completa para gerenciamento de timelines de projetos, permitindo o acompanhamento de atividades, marcos e progresso de projetos. A aplicação foi desenvolvida utilizando tecnologias modernas e seguindo as melhores práticas de desenvolvimento.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações server-side eficientes e escaláveis
- **Prisma**: ORM (Object-Relational Mapping) para acesso ao banco de dados MySQL
- **MongoDB**: Banco de dados NoSQL para armazenamento de dados flexíveis
- **JWT**: Autenticação baseada em tokens
- **Swagger/OpenAPI**: Documentação da API
- **Winston**: Sistema de logging avançado
- **Docker/ECS**: Containerização e orquestração

## Funcionalidades Principais

- Autenticação e autorização com diferentes níveis de permissão
- Gerenciamento de timelines de projetos
- Verificação de saúde da aplicação
- Logging avançado com suporte ao CloudWatch
- Documentação interativa da API

## Estrutura do Projeto

```
src/
├── auth/           # Módulo de autenticação e autorização
├── health/         # Verificação de saúde da aplicação
├── logging/        # Sistema de logging
├── prisma/         # Configuração do Prisma ORM
├── timelines/      # Módulo principal de timelines
├── app.module.ts   # Módulo principal da aplicação
└── main.ts         # Ponto de entrada da aplicação
```

## Requisitos

- Node.js (LTS)
- MySQL
- MongoDB
- Docker (opcional)

## Instalação

1. Clone o repositório:

    ```bash
    git clone [URL_DO_REPOSITORIO]
    cd timeline-api
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente:

    ```bash
    cp .env.example .env
    # Edite o arquivo .env com suas configurações
    ```

4. Execute as migrações do Prisma:

    ```bash
    npm run prisma:generate
    ```

5. Inicie a aplicação:
    ```bash
    npm run dev
    ```

## Endpoints da API

A API oferece diversos endpoints para gerenciamento de timelines. A documentação completa está disponível através do Swagger:

- **Documentação Swagger**: http://localhost:3000/swagger
- **Documentação Scalar**: http://localhost:3000/api-docs

## Verificação de Saúde

A API inclui endpoints de verificação de saúde para monitoramento:

- **Verificação Básica**: `GET /`
- **Verificação Detalhada**: `GET /health`

Para mais detalhes, consulte o arquivo [HEALTH.md](HEALTH.md).

## Sistema de Logging

A aplicação implementa um sistema de logging avançado, otimizado para AWS CloudWatch. Para mais informações, consulte o arquivo [LOGGING.md](LOGGING.md).

## Implantação

A aplicação está configurada para ser implantada em contêineres Docker e orquestrada pelo AWS ECS. As configurações necessárias para implantação estão incluídas no projeto.

## Desenvolvimento

Para contribuir com o desenvolvimento:

1. Crie um branch para sua feature:

    ```bash
    git checkout -b feature/nome-da-feature
    ```

2. Faça suas alterações e commit:

    ```bash
    git commit -m "Descrição da alteração"
    ```

3. Envie para o repositório:

    ```bash
    git push origin feature/nome-da-feature
    ```

4. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença ISC - veja o arquivo LICENSE para mais detalhes.
