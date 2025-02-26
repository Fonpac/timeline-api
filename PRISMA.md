# Usando Prisma com Banco de Dados Existente

Este projeto utiliza o ORM Prisma para interagir com um banco de dados MySQL existente. A configuração está definida para extrair o esquema do banco de dados sem fazer alterações na estrutura do banco.

## Configuração

1. Certifique-se de que seu arquivo `.env` contém a string de conexão correta do banco de dados:

```
DATABASE_URL="mysql://web-backend:q)=7M16Q?|kO70~LYO@mysql.alpha.constructin.dev:3306/alpha"
```

OU

```
MYSQL_URL="mysql://web-backend:q)=7M16Q?|kO70~LYO@mysql.alpha.constructin.dev:3306/alpha"
```

> **Importante**:
>
> - Sempre inclua o número da porta (`:3306`) na sua string de conexão MySQL. O Prisma requer isso para uma conexão adequada.
> - O script de configuração verificará tanto as variáveis de ambiente `DATABASE_URL` quanto `MYSQL_URL`.

2. Execute o script de configuração para extrair o esquema do banco de dados e gerar o cliente Prisma:

```
npm run prisma:setup
```

Ou manualmente:

```
npx prisma db pull --force
npx prisma generate
```

## Notas Importantes

- O comando `prisma db pull` com a flag `--force` sobrescreverá o arquivo de esquema com a estrutura atual do banco de dados.
- Não modifique manualmente o arquivo de esquema, pois ele será sobrescrito quando você executar `prisma db pull`.
- A configuração `relationMode = "prisma"` no arquivo de esquema garante que o Prisma não tente criar restrições de chave estrangeira no banco de dados.

## Usando Prisma em Seu Código

O `PrismaService` já está configurado e pode ser injetado em seus controladores e serviços:

```typescript
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SeuServico {
    constructor(private prisma: PrismaService) {}

    async buscarTodos() {
        return this.prisma.seuModelo.findMany()
    }
}
```

## Prisma Studio

Você pode usar o Prisma Studio para navegar e gerenciar seus dados:

```
npm run prisma:studio
```

Isso abrirá uma interface web em http://localhost:5555 onde você pode visualizar e editar seus dados.

## Solução de Problemas

Se você encontrar problemas com a conexão do banco de dados:

1. Verifique se seu arquivo `.env` contém a string de conexão correta com o número da porta (`:3306`)
2. Certifique-se de que o usuário do banco de dados tem as permissões necessárias
3. Verifique os logs para quaisquer erros de conexão
4. Tente executar `npx prisma validate` para verificar sua string de conexão
5. Se você receber um erro de "número de porta inválido", certifique-se de ter incluído a porta na sua string de conexão
6. O script de configuração detectará automaticamente se você está usando `DATABASE_URL` ou `MYSQL_URL`
