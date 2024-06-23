import React from 'react';
import Link from 'next/link';
import { trpc } from '../utils/trpc';

const Dashboard: React.FC = () => {
  const { data: recentRoasts, isLoading } = trpc.roastLog.getRecent.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <Link href="/roast-log/new">Create New Roast Log</Link>
      <Link href="/roast-profile/new">Create New Roast Profile</Link>
      <h2>Recent Roasts</h2>
      {recentRoasts?.map((roast) => (
        <div key={roast.id}>
          <p>{roast.date.toLocaleDateString()}: {roast.beanType}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;