# Using Prisma with Existing Database

This project uses Prisma ORM to interact with an existing MySQL database. The setup is configured to pull the database schema without making any changes to the database structure.

## Setup

1. Make sure your `.env` file contains the correct database connection string:

```
DATABASE_URL="mysql://web-backend:q)=7M16Q?|kO70~LYO@mysql.alpha.constructin.dev:3306/alpha"
```

OR

```
MYSQL_URL="mysql://web-backend:q)=7M16Q?|kO70~LYO@mysql.alpha.constructin.dev:3306/alpha"
```

> **Important**:
>
> - Always include the port number (`:3306`) in your MySQL connection string. Prisma requires this for proper connection.
> - The setup script will check for both `DATABASE_URL` and `MYSQL_URL` environment variables.

2. Run the setup script to pull the database schema and generate the Prisma client:

```
npm run prisma:setup
```

Or manually:

```
npx prisma db pull --force
npx prisma generate
```

## Important Notes

- The `prisma db pull` command with the `--force` flag will overwrite the schema file with the current database structure.
- Do not manually modify the schema file as it will be overwritten when you run `prisma db pull`.
- The `relationMode = "prisma"` setting in the schema file ensures that Prisma doesn't try to create foreign key constraints in the database.

## Using Prisma in Your Code

The `PrismaService` is already set up and can be injected into your controllers and services:

```typescript
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class YourService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.yourModel.findMany()
    }
}
```

## Prisma Studio

You can use Prisma Studio to browse and manage your data:

```
npm run prisma:studio
```

This will open a web interface at http://localhost:5555 where you can view and edit your data.

## Troubleshooting

If you encounter any issues with the database connection:

1. Check that your `.env` file contains the correct connection string with the port number (`:3306`)
2. Make sure the database user has the necessary permissions
3. Check the logs for any connection errors
4. Try running `npx prisma validate` to verify your connection string
5. If you get an "invalid port number" error, make sure you've included the port in your connection string
6. The setup script will automatically detect whether you're using `DATABASE_URL` or `MYSQL_URL`
