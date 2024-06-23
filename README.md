# Coffee Roast Logging Application

## Overview

This Coffee Roast Logging Application is a comprehensive tool designed for coffee roasters to track their roasts, manage green bean inventory, create and use roast profiles, and log cupping notes. Built with modern web technologies, it focuses on type safety, scalability, and user experience.

## Key Features

1. Roast Logging: Record and track individual coffee roasts
2. Green Bean Inventory: Manage your green coffee bean stock
3. Roast Profiles: Create, store, and use roast profiles for consistency
4. Cupping Notes: Log detailed cupping notes for each roast
5. Dashboard: Get an overview of recent roasts and low stock alerts

## Tech Stack

- Frontend: React with Next.js
- Backend: tRPC for end-to-end typesafe APIs
- Database: PostgreSQL with Prisma as ORM
- Styling: Tailwind CSS
- Testing: Playwright for E2E tests, Vitest for unit tests

## Project Structure

```
/
├── src/
│   ├── pages/
│   ├── components/
│   ├── server/
│   │   └── routers/
│   └── utils/
├── prisma/
├── public/
└── tests/
```

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up your PostgreSQL database
4. Copy `.env.example` to `.env` and fill in your database credentials
5. Run database migrations: `pnpm prisma migrate dev`
6. Start the development server: `pnpm dev`

## Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the production application
- `pnpm start`: Start the production server
- `pnpm test`: Run all tests
- `pnpm test:e2e`: Run end-to-end tests
- `pnpm test:unit`: Run unit tests

## API Routes

The API is built using tRPC, providing end-to-end type safety. The main routers include:

- roastLog
- roastProfile
- greenBean
- cuppingNote

These routers are defined in the `src/server/routers` directory.

## Database Schema

The database schema is defined using Prisma and includes the following main models:

- User
- RoastLog
- RoastProfile
- GreenBean
- CuppingNote

## Deployment

The project is set up for easy deployment on Render.com using the provided `render.yaml` file. You can also deploy to other platforms that support Next.js applications.

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.

---

This README provides a comprehensive overview of the Coffee Roast Logging Application, its features, structure, and how to get started with development. It's designed to give developers and users a clear understanding of the project's capabilities and architecture.
