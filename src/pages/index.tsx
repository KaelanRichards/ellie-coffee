import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import Link from 'next/link';

const IndexPage: NextPageWithLayout = () => {
  const recentRoastsQuery = trpc.roastLog.getRecent.useQuery();
  const lowStockBeansQuery = trpc.greenBean.getLowStock.useQuery({
    threshold: 5,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">
        Coffee Roast Logging Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Roasts</h2>
          {recentRoastsQuery.isLoading ? (
            <p>Loading recent roasts...</p>
          ) : (
            <ul className="space-y-2">
              {recentRoastsQuery.data?.map((roast) => (
                <li key={roast.id} className="bg-gray-100 p-3 rounded">
                  <Link
                    href={`/roast-log/${roast.id}`}
                    className="hover:underline"
                  >
                    <span className="font-medium">
                      {roast.date.toLocaleDateString()}
                    </span>{' '}
                    - {roast.beanType}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Low Stock Alerts</h2>
          {lowStockBeansQuery.isLoading ? (
            <p>Loading low stock beans...</p>
          ) : (
            <ul className="space-y-2">
              {lowStockBeansQuery.data?.map((bean) => (
                <li key={bean.id} className="bg-yellow-100 p-3 rounded">
                  <Link
                    href={`/green-bean/${bean.id}`}
                    className="hover:underline"
                  >
                    <span className="font-medium">
                      {bean.origin} - {bean.variety}
                    </span>
                    <br />
                    Quantity: {bean.quantity}kg
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 space-x-4">
        <Link
          href="/roast-log/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          New Roast Log
        </Link>
        <Link
          href="/roast-profile/new"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          New Roast Profile
        </Link>
        <Link
          href="/green-bean/new"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Green Beans
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
