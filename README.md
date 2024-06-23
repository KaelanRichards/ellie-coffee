# Coffee Roast Logging Application

## Overview

This project is a comprehensive Coffee Roast Logging Application built using modern web technologies. It's designed to help coffee roasters track their roasts, manage green bean inventory, create and use roast profiles, and log cupping notes. The application is built with a focus on type safety, scalability, and user experience.

## Key Features

1. **Roast Logging**: Record and track individual coffee roasts.
2. **Green Bean Inventory**: Manage your green coffee bean stock.
3. **Roast Profiles**: Create, store, and use roast profiles for consistency.
4. **Cupping Notes**: Log detailed cupping notes for each roast.
5. **Dashboard**: Get an overview of recent roasts and low stock alerts.

## Tech Stack

- **Frontend**: React with Next.js
- **Backend**: tRPC for end-to-end typesafe APIs
- **Database**: PostgreSQL with Prisma as ORM
- **Styling**: Tailwind CSS
- **Authentication**: (To be implemented)
- **Testing**: Playwright for E2E tests, Vitest for unit tests

## Project Structure

The project follows a typical Next.js structure with some additional directories for tRPC and Prisma:

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

## Key Components

1. **Roast Log**:
   - Create new roast logs
   - View and edit existing logs
   - Reference:

```1:105:src/pages/roast-log/[id].tsx
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';

const RoastLogPage
```

2. **Green Bean Inventory**:
   - Add new green beans
   - Track quantity and purchase dates
   - Reference:

```1:108:src/pages/green-bean/[id].tsx
};

export default GreenBeanPage;
```

3. **Roast Profiles**:
   - Create and edit roast profiles
   - Use profiles in roast logs
   - Reference:

```6:76:src/pages/roast-profile/[id].tsx
const RoastProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: profile, isLoading } = trpc.roastProfile.getById.useQuery({
    id: id as string,
  });
  const updateProfile = trpc.roastProfile.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateProfile.mutateAsync({
      id: profile.id,
      name: formData.get('name') as string,
      data: JSON.parse(formData.get('data') as string),
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/roast-profile" className="btn btn-secondary mb-4">
        Back to Profiles
      </Link>
      <h1 className="text-3xl font-bold mb-4">Roast Profile Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={profile.name}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Data (JSON)</label>
            <textarea
              name="data"
              defaultValue={JSON.stringify(profile.data)}
              className="textarea"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>Name: {profile.name}</p>
          <p>Data: {JSON.stringify(profile.data)}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary mt-4"
          >
            Edit
          </button>
        </div>
      )}
      {/* Add a visual representation of the roast curve here */}
    </div>
  );
}
```

4. **Cupping Notes**:
   - Log detailed cupping notes for each roast
   - Reference:

```1:97:src/pages/cupping-note/[id].tsx
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NewCuppingNote
```

5. **Dashboard**:
   - Overview of recent roasts and low stock alerts
   - Reference:

```1:45:src/pages/Dashboard/index.tsx
import { trpc } from '~/utils/trpc';
import Link from 'next/link';

const DashboardPage = () => {
  const { data: recentRoasts, isLoading } = trpc.roastLog.getRecent.useQuery();
  const { data: lowStockBeans } = trpc.greenBean.getLowStock.useQuery({
    threshold: 5,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Roast Logging Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Recent Roasts</h2>
          {recentRoasts?.map((roast) => (
            <div key={roast.id} className="mb-2">
              <Link href={`/roast-log/${roast.id}`}>
                {roast.date.toLocaleDateString()} - {roast.beanType}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Low Stock Alerts</h2>
          {lowStockBeans?.map((bean) => (
            <div key={bean.id} className="mb-2">
              {bean.origin} - {bean.variety}: {bean.quantity}kg remaining
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <Link href="/roast-log/new" className="btn btn-primary mr-2">
          New Roast Log
        </Link>
        <Link href="/roast-profile/new" className="btn btn-secondary">
          New Roast Profile
        </Link>
      </div>
    </div>
  );
};
```

## Database Schema

The database schema is defined using Prisma and includes the following main models:

- User
- RoastLog
- RoastProfile
- GreenBean
- CuppingNote

Reference:

```1:74:prisma/schema.prisma
datasource db {
  provider = "postgres"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  roastLogs RoastLog[]
  profiles  RoastProfile[]
}

model RoastLog {
  id           String   @id @default(uuid())
  date         DateTime
  beanType     String
  profileId    String
  profile      RoastProfile @relation(fields: [profileId], references: [id])
  equipment    String
  notes        String?
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  cuppingNotes CuppingNote[]
}

model RoastProfile {
  id        String   @id @default(uuid())
  name      String
  data      Json
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  roastLogs RoastLog[]
}
```

## API Routes

The API is built using tRPC, providing end-to-end type safety. The main routers include:

- roastLog
- roastProfile
- greenBean
- cuppingNote

These routers are defined in the `src/server/routers` directory.

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

## Deployment

The project is set up for easy deployment on Render.com using the provided `render.yaml` file. You can also deploy to other platforms that support Next.js applications.

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.

---

This README provides a comprehensive overview of the Coffee Roast Logging Application, its features, structure, and how to get started with development. It's designed to give developers and users a clear understanding of the project's capabilities and architecture.
