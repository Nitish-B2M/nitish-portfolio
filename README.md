# Portfolio Project

A modern portfolio website built with Next.js 14, Prisma, and MySQL.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Development](#development)
- [Prisma Commands](#prisma-commands)
- [Common Issues & Solutions](#common-issues--solutions)
- [Project Structure](#project-structure)

## Prerequisites

- Node.js 18.x or later
- MySQL 8.0 or later
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Environment Setup

1. Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/portfolio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional: Email Provider (if using email authentication)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@example.com
```

## Database Setup

1. Initialize Prisma:
```bash
npx prisma init
```

2. Apply database migrations:
```bash
npx prisma migrate dev
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

4. (Optional) Seed the database:
```bash
npx prisma db seed
```

## Development

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Build for production:
```bash
npm run build
# or
yarn build
```

3. Start production server:
```bash
npm start
# or
yarn start
```

## Prisma Commands

### Schema Changes

1. After modifying the schema:
```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations without modifying the schema
npx prisma migrate deploy

# Reset database and apply all migrations
npx prisma migrate reset

# Push schema changes without creating migrations (development only)
npx prisma db push
```

2. Update Prisma Client:
```bash
npx prisma generate
```

### Database Management

1. View database in Prisma Studio:
```bash
npx prisma studio
```

2. Pull changes from existing database:
```bash
npx prisma db pull
```

### Model Updates

When updating models in `schema.prisma`, follow these steps:

1. Make changes to the schema
2. Create a migration:
```bash
npx prisma migrate dev --name <descriptive-name>
```
3. Update types (if using TypeScript):
```bash
npx prisma generate
```

## Common Issues & Solutions

### Prisma Client Generation Issues

If you encounter issues with Prisma Client generation:

1. Delete generated files:
```bash
rm -rf node_modules/.prisma
```

2. Reinstall dependencies:
```bash
npm install
```

3. Regenerate Prisma Client:
```bash
npx prisma generate
```

### Database Connection Issues

1. Verify your database connection:
```bash
npx prisma db pull
```

2. Reset the database (caution: this will delete all data):
```bash
npx prisma migrate reset
```

## Project Structure

```
portfolio/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── admin/
│   │   └── auth/
│   ├── components/
│   ├── lib/
│   └── types/
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Key Directories

- `prisma/`: Database schema and migrations
- `src/app/`: Next.js application routes and API endpoints
- `src/components/`: Reusable React components
- `src/lib/`: Utility functions and configurations
- `src/types/`: TypeScript type definitions

## License

[MIT](LICENSE)
