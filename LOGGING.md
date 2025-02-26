# Sistema de Logging para a API Timeline

Este documento descreve o sistema de logging implementado para a API Timeline, que foi projetado para funcionar perfeitamente com o AWS CloudWatch Log Insights quando implantado no ECS.

## Visão Geral

O sistema de logging utiliza Winston como biblioteca de logging e é integrado com o NestJS através do pacote `nest-winston`. Ele fornece logging estruturado que é otimizado para consultas no CloudWatch Log Insights.

## Funcionalidades

- **Logging JSON Estruturado**: Todos os logs são formatados como objetos JSON nos ambientes de produção e alpha, tornando-os facilmente consultáveis no CloudWatch Log Insights.
- **Logs Simplificados em Desenvolvimento**: No modo de desenvolvimento, os logs são simplificados para mostrar apenas informações essenciais.
- **Logging de Requisições/Respostas**: Todas as requisições HTTP e respostas são automaticamente registradas com metadados.
- **Rastreamento de Erros**: Todas as exceções são capturadas e registradas com stack traces.
- **Rastreamento de ID de Requisição**: Cada requisição recebe um ID único que é incluído em todos os logs relacionados.
- **Configuração Sensível ao Ambiente**: Diferentes formatos de log baseados no ambiente (desenvolvimento vs. produção/alpha).
- **Redação de Dados Sensíveis**: Automaticamente oculta informações sensíveis como senhas e tokens.

## Formato de Log

### Formato de Produção/Alpha (CloudWatch)

Nos ambientes de produção e alpha, os logs são formatados como objetos JSON com a seguinte estrutura:

```json
{
    "timestamp": "2023-02-26T12:34:56.789Z",
    "level": "info",
    "message": "A mensagem de log",
    "metadata": "{\"context\":\"HTTP\",\"requestId\":\"123e4567-e89b-12d3-a456-426614174000\",\"method\":\"GET\",\"url\":\"/api/timelines\",\"statusCode\":200,\"responseTime\":\"42ms\"}"
}
```

Este formato é otimizado para consultas no CloudWatch Log Insights.

### Formato de Desenvolvimento

No modo de desenvolvimento, os logs são simplificados para um formato mais legível:

```
2023-02-26 12:34:56 - INFO: [HTTP] Requisição recebida: GET /api/timelines
```

Isso torna mais fácil a leitura dos logs durante o desenvolvimento local sem os metadados extras.

## Consultas no CloudWatch Log Insights

Aqui estão alguns exemplos de consultas que você pode usar no CloudWatch Log Insights:

### Encontrar todos os logs para um ID de requisição específico

```
fields @timestamp, @message
| parse @message "\"requestId\":\"*\"" as requestId
| filter requestId = "123e4567-e89b-12d3-a456-426614174000"
| sort @timestamp asc
```

### Encontrar todos os logs de erro

```
fields @timestamp, @message
| filter level = "error"
| sort @timestamp desc
```

### Encontrar respostas lentas (>500ms)

```
fields @timestamp, @message
| parse @message "\"responseTime\":\"*ms\"" as responseTime
| filter responseTime > 500
| sort responseTime desc
```

### Contar requisições por código de status

```
fields @timestamp, @message
| parse @message "\"statusCode\":*," as statusCode
| stats count(*) as count by statusCode
| sort count desc
```

## Desenvolvimento Local

No modo de desenvolvimento, os logs são impressos no console em um formato simplificado que mostra apenas o timestamp, nível de log, contexto (se disponível) e mensagem. Isso torna os logs muito mais legíveis durante o desenvolvimento local.

## Uso no Código

Para usar o logger no seu código:

```typescript
import { Injectable } from '@nestjs/common'
import { LoggingService } from '../logging/logging.service'

@Injectable()
export class SeuServico {
    constructor(private readonly logger: LoggingService) {}

    algumMetodo() {
        this.logger.log('Esta é uma mensagem de informação', 'SeuServico', {
            dadosAdicionais: 'algum valor',
        })

        try {
            // Algum código que pode lançar exceção
        } catch (error) {
            this.logger.error('Ocorreu um erro', error.stack, 'SeuServico', {
                dadosAdicionais: 'algum valor',
            })
        }
    }
}
```

## Configuração ECS

Quando implantado no ECS, os logs serão automaticamente enviados para o CloudWatch. Nenhuma configuração adicional é necessária no código da aplicação, pois o ECS gerencia o encaminhamento dos logs para o CloudWatch.
