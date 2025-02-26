# Timeline API

API para gerenciamento de timelines de projetos, construída com NestJS, Prisma (MySQL) e Mongoose (MongoDB).

## Visão Geral

Esta API permite o gerenciamento completo de timelines de projetos, com suporte a:
- Armazenamento dual em MySQL (via Prisma) e MongoDB (via Mongoose)
- Criação e atualização de timelines com múltiplas tarefas
- Acompanhamento de progresso planejado vs. real
- Histórico de alterações
- Documentação interativa via Swagger e Scalar

## Tecnologias

- **Backend**: NestJS (Node.js)
- **Bancos de Dados**:
  - MySQL (via Prisma ORM)
  - MongoDB (via Mongoose)
- **Documentação**:
  - Swagger
  - Scalar API Reference
- **Validação**: class-validator e class-transformer
- **Ambiente**: Configuração via dotenv

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd timeline-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e configure as conexões de banco de dados
cp .env.example .env
```

## Configuração do Banco de Dados

### MySQL com Prisma

1. Certifique-se de que seu banco de dados MySQL está rodando
2. Configure a URL de conexão no arquivo `.env`:
   ```
   DATABASE_URL="mysql://usuario:senha@localhost:3306/timeline_db"
   ```
3. Execute o comando para gerar o cliente Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Para puxar o schema de um banco existente:
   ```bash
   npm run prisma:pull
   ```
5. Para visualizar e gerenciar seus dados via interface gráfica:
   ```bash
   npm run prisma:studio
   ```

### MongoDB

1. Certifique-se de que seu banco de dados MongoDB está rodando
2. Configure a URL de conexão no arquivo `.env`:
   ```
   MONGODB_URI="mongodb://localhost:27017/timeline_db"
   ```

## Executando a aplicação

```bash
# Modo de desenvolvimento com hot-reload
npm run dev

# Compilar o projeto
npm run build

# Modo de produção
npm run start:prod

# Verificar problemas de linting
npm run lint

# Formatar o código
npm run format
```

## Estrutura do Projeto

```
timeline-api/
├── prisma/                  # Configuração e schema do Prisma
├── src/
│   ├── database/            # Configuração de conexão com bancos de dados
│   │   ├── timelines/       # Módulo principal de timelines
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── entities/    # Entidades e schemas
│   │   │   ├── timelines.controller.ts
│   │   │   ├── timelines.module.ts
│   │   │   └── timelines.service.ts
│   │   ├── app.module.ts    # Módulo principal da aplicação
│   │   └── main.ts          # Ponto de entrada da aplicação
│   ├── .env                 # Variáveis de ambiente (não versionado)
│   ├── .env.example         # Exemplo de variáveis de ambiente
│   └── package.json         # Dependências e scripts
```

## Documentação da API

A documentação interativa da API está disponível em:

- **Scalar API Reference**: http://localhost:3000/api-docs (interface moderna e amigável)
- **Swagger**: http://localhost:3000/swagger (interface tradicional do Swagger)

## Endpoints da API

### Timelines

- `GET /project/{projectId}/timelines/history` - Obter histórico de progresso do projeto
- `GET /project/{projectId}/timelines` - Listar todas as timelines de um projeto
- `POST /project/{projectId}/timelines` - Criar uma nova timeline
- `GET /project/{projectId}/timelines/latest` - Obter a timeline mais recente
- `GET /project/{projectId}/timelines/dashboard` - Obter dados do dashboard
- `GET /project/{projectId}/timelines/{timelineId}` - Obter uma timeline específica
- `PATCH /project/{projectId}/timelines/{timelineId}` - Atualizar uma timeline
- `DELETE /project/{projectId}/timelines/{timelineId}` - Excluir uma timeline
- `DELETE /project/{projectId}/timelines/{timelineId}/progress` - Excluir progresso de uma data específica

### Tarefas

- `PATCH /project/{projectId}/timelines/{timelineId}/task/{taskId}` - Atualizar medição de uma tarefa
- `PATCH /project/{projectId}/timelines/{timelineId}/task/bulk` - Atualizar múltiplas tarefas de uma vez

## Modelo de Dados

### Timeline

- **projectId**: ID do projeto
- **name**: Nome da timeline
- **description**: Descrição (opcional)
- **startDate**: Data de início
- **endDate**: Data de término
- **tasks**: Lista de tarefas

### Task

- **id**: ID da tarefa
- **name**: Nome da tarefa
- **startDate**: Data de início planejada
- **endDate**: Data de término planejada
- **actualStartDate**: Data de início real (opcional)
- **actualEndDate**: Data de término real (opcional)
- **weight**: Peso da tarefa no projeto
- **duration**: Duração em dias
- **cost**: Custo estimado (opcional)
- **hierarchy**: Hierarquia da tarefa (opcional)
- **planned_progress**: Progresso planejado
- **actual_progress**: Progresso real
- **executionStatus**: Status de execução (planejada, iniciada, concluída)
- **overallStatus**: Status geral (no prazo, atrasada, adiantada)
- **subtasks**: Subtarefas (opcional)

## Licença

ISC #   t i m e l i n e - a p i  
 