# Timeline API

API para gerenciamento de timelines de projetos, construída com NestJS e MongoDB.

## Visão Geral

Esta API permite o gerenciamento completo de timelines de projetos, com suporte a:
- Armazenamento em MongoDB (via Mongoose)
- Criação e atualização de timelines com múltiplas tarefas
- Acompanhamento de progresso planejado vs. real
- Histórico de alterações
- Documentação interativa via Swagger
- Decoradores personalizados para simplificar a documentação da API
- CORS habilitado para permitir acesso de qualquer origem
- Formatação de código padronizada com Prettier

## Tecnologias

- **Backend**: NestJS (Node.js)
- **Banco de Dados**: MongoDB (via Mongoose)
- **Documentação**: Swagger
- **Validação**: class-validator e class-transformer
- **Ambiente**: Configuração via dotenv
- **Segurança**: CORS configurado para acesso cross-origin
- **Formatação**: Prettier com configuração personalizada

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

### MongoDB

1. Certifique-se de que seu banco de dados MongoDB está rodando
2. Configure a URL de conexão no arquivo `.env`:
   ```
   MONGODB_URI="mongodb://localhost:27017/timeline_db"
   ```

## Configuração do CORS

A API está configurada para permitir requisições de qualquer origem (CORS habilitado com wildcard '*'). Isso facilita a integração com aplicações frontend hospedadas em diferentes domínios.

```typescript
// Configuração em src/main.ts
app.enableCors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

Para restringir o acesso a domínios específicos, modifique a configuração `origin` para uma lista de domínios permitidos.

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
├── src/
│   ├── timelines/            # Módulo principal de timelines
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entities/         # Entidades e schemas
│   │   ├── utils/            # Utilitários
│   │   │   └── timeline-processor.ts  # Processamento de timelines
│   │   ├── documentation/    # Documentação da API
│   │   │   ├── decorators.ts          # Decoradores personalizados
│   │   │   ├── error-responses.ts     # Respostas de erro padronizadas
│   │   │   ├── request-examples.ts    # Exemplos de requisições
│   │   │   ├── response-models.ts     # Modelos de resposta
│   │   │   └── index.ts               # Exportações
│   │   ├── timelines.controller.ts
│   │   ├── timelines.module.ts
│   │   └── timelines.service.ts
│   ├── app.module.ts         # Módulo principal da aplicação
│   └── main.ts               # Ponto de entrada da aplicação
├── .env                      # Variáveis de ambiente (não versionado)
├── .env.example              # Exemplo de variáveis de ambiente
└── package.json              # Dependências e scripts
```

## Documentação da API

A documentação interativa da API está disponível em:

- **Swagger**: http://localhost:3000/swagger

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
- **currency**: Moeda utilizada para custos
- **createdAt**: Data de criação
- **createdBy**: ID do usuário que criou
- **plannedProgress**: Progresso planejado por data
- **actualProgress**: Progresso real por data
- **tasks**: Lista de tarefas
- **worksSaturdays**: Se trabalha aos sábados (opcional)
- **worksSundays**: Se trabalha aos domingos (opcional)

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
- **plannedProgress**: Progresso planejado
- **actualProgress**: Progresso real
- **executionStatus**: Status de execução (planned, started, completed)
- **overallStatus**: Status geral (on_time, ahead, delayed)
- **subtasks**: Subtarefas (opcional)

## Decoradores Personalizados

O projeto utiliza decoradores personalizados para simplificar a documentação da API e reduzir a duplicação de código. Esses decoradores estão localizados em `src/timelines/documentation/decorators.ts`.

### Decoradores de Parâmetros

- `ApiProjectParam()`: Adiciona o parâmetro projectId à documentação
- `ApiTimelineParam()`: Adiciona o parâmetro timelineId à documentação
- `ApiTaskParam()`: Adiciona o parâmetro taskId à documentação
- `ApiFilterQuery()`: Adiciona os parâmetros de filtro à documentação

### Decoradores de Endpoints

- `ApiGetHistory()`: Documentação para o endpoint de histórico
- `ApiGetAllTimelines()`: Documentação para o endpoint de listar timelines
- `ApiCreateTimeline()`: Documentação para o endpoint de criar timeline
- `ApiGetLatestTimeline()`: Documentação para o endpoint de obter a timeline mais recente
- `ApiGetDashboard()`: Documentação para o endpoint de dashboard
- `ApiGetOneTimeline()`: Documentação para o endpoint de obter uma timeline específica
- `ApiUpdateTimeline()`: Documentação para o endpoint de atualizar timeline
- `ApiDeleteTimeline()`: Documentação para o endpoint de excluir timeline
- `ApiDeleteProgress()`: Documentação para o endpoint de excluir progresso
- `ApiUpdateMeasurement()`: Documentação para o endpoint de atualizar medição
- `ApiBulkUpdateTask()`: Documentação para o endpoint de atualizar múltiplas tarefas

### Exemplo de Uso

```typescript
@Get('history')
@ApiGetHistory()
async getHistoryProjects(@Param('projectId') projectId: string, @Req() request: any) {
  const timelines = await this.timelinesService.getHistoryProjects(projectId);
  return timelines;
}
```

## Organização da Documentação

A documentação da API está organizada em vários arquivos:

- **response-models.ts**: Contém os modelos de resposta da API
- **error-responses.ts**: Contém as respostas de erro padronizadas
- **request-examples.ts**: Contém exemplos de requisições
- **decorators.ts**: Contém os decoradores personalizados
- **index.ts**: Exporta todos os componentes de documentação

Esta organização facilita a manutenção da documentação e reduz a duplicação de código.

## Formatação de Código

O projeto utiliza Prettier para manter um estilo de código consistente. A configuração está definida no arquivo `.prettierrc`:

```json
{
    "semi": false,
    "singleQuote": true,
    "tabWidth": 4,
    "printWidth": 160,
    "trailingComma": "es5"
}
```

Para formatar o código, execute um dos seguintes comandos:

```bash
# Formatar apenas arquivos TypeScript no diretório src
npm run format

# Formatar todos os arquivos do projeto
npm run format:all
```

## Licença

ISC
