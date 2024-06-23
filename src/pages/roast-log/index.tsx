import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const RoastLogsPage = () => {
  const { data: roastLogs, isLoading } = trpc.roastLog.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Roast Logs</h1>
      <Link href="/roast-log/new" className="btn btn-primary mb-4">
        New Roast Log
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roastLogs?.map((log) => (
          <div key={log.id} className="border p-4 rounded">
            <Link href={`/roast-log/${log.id}`}>
              <h2 className="text-xl font-semibold">
                {log.date.toLocaleDateString()}
              </h2>
              <p>Bean: {log.beanType}</p>
              <p>Profile: {log.profile.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoastLogsPage;
