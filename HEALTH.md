# Endpoints de Verificação de Saúde

Este documento descreve os endpoints de verificação de saúde implementados para a API Timeline.

## Visão Geral

A aplicação fornece dois endpoints de verificação de saúde:

- Endpoint raiz (`/`): Verificação básica de saúde
- Endpoint de saúde (`/health`): Verificação detalhada de saúde, incluindo o status dos serviços

Estes endpoints são úteis para:

- Sistemas de orquestração de contêineres (como ECS) para determinar se a aplicação está saudável
- Balanceadores de carga para direcionar tráfego apenas para instâncias saudáveis
- Sistemas de monitoramento para alertar quando a aplicação não estiver saudável

## Endpoints

### Endpoint Raiz (/)

**URL**: `/`  
**Método**: `GET`  
**Autenticação necessária**: Não (endpoint público)

#### Resposta de Sucesso

**Código**: `200 OK`  
**Exemplo de conteúdo**:

```json
{
    "status": "ok",
    "timestamp": "2023-02-26T12:34:56.789Z",
    "uptime": "1h 23m 45s",
    "version": "1.0.0",
    "environment": "development",
    "hostname": "server-name"
}
```

### Endpoint de Saúde (/health)

**URL**: `/health`  
**Método**: `GET`  
**Autenticação necessária**: Não (endpoint público)

Este endpoint fornece uma verificação de saúde mais detalhada, incluindo o status dos serviços individuais.

#### Resposta de Sucesso

**Código**: `200 OK`  
**Exemplo de conteúdo**:

```json
{
    "status": "ok",
    "timestamp": "2023-02-26T12:34:56.789Z",
    "uptime": "1h 23m 45s",
    "version": "1.0.0",
    "environment": "development",
    "hostname": "server-name",
    "services": {
        "mysql": "ok",
        "mongodb": "ok"
    }
}
```

#### Resposta de Erro

Se um ou mais serviços não estiverem saudáveis, o endpoint ainda retornará um código de status 200, mas o campo `status` será `degraded` e o serviço não saudável será marcado como `error`:

```json
{
    "status": "degraded",
    "timestamp": "2023-02-26T12:34:56.789Z",
    "uptime": "1h 23m 45s",
    "version": "1.0.0",
    "environment": "development",
    "hostname": "server-name",
    "services": {
        "mysql": "ok",
        "mongodb": "error"
    }
}
```

## Verificações de Saúde do Banco de Dados

A verificação de saúde realiza os seguintes testes de banco de dados:

### MySQL (via Prisma)

- Executa uma consulta simples `SELECT 1` para verificar se a conexão está funcionando
- Reporta o status como `ok` se bem-sucedido, `error` se falhar

### MongoDB

- Verifica se a conexão está em um estado pronto
- Executa um comando de ping para verificar se a conexão está funcionando
- Reporta o status como `ok` se bem-sucedido, `error` se falhar

## Códigos de Status

- `ok`: Todos os sistemas estão operacionais
- `degraded`: Alguns sistemas estão enfrentando problemas
- `error`: Sistemas críticos estão fora do ar

## Configuração AWS ECS

Ao usar esses endpoints de verificação de saúde com AWS ECS, você pode configurar a verificação de saúde em sua definição de tarefa:

```json
"healthCheck": {
  "command": [
    "CMD-SHELL",
    "curl -f http://localhost:3000/health || exit 1"
  ],
  "interval": 30,
  "timeout": 5,
  "retries": 3,
  "startPeriod": 60
}
```

Esta configuração irá:

- Verificar o endpoint `/health` a cada 30 segundos
- Permitir 5 segundos para a verificação de saúde ser concluída
- Tentar novamente 3 vezes antes de marcar o contêiner como não saudável
- Permitir 60 segundos para a aplicação iniciar antes de começar as verificações de saúde
