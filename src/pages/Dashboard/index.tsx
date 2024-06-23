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

export default DashboardPage;
