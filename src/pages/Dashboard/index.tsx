import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { CgCoffee, CgNotes, CgDatabase } from 'react-icons/cg';
import { FaThermometerHalf, FaWeightHanging } from 'react-icons/fa';

const DashboardPage = () => {
  const { data: recentRoasts, isLoading: roastsLoading } =
    trpc.roastLog.getRecent.useQuery();
  const { data: lowStockBeans, isLoading: beansLoading } =
    trpc.greenBean.getLowStock.useQuery({
      threshold: 5,
    });

  if (roastsLoading || beansLoading) {
    return (
      <div className="flex items-center justify-center h-screen" role="status">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brown-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-light mb-8 text-gray-900">
          Roast Master Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section
            aria-labelledby="recent-roasts-heading"
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2
              id="recent-roasts-heading"
              className="text-xl font-light mb-4 text-gray-800 flex items-center"
            >
              <CgCoffee className="mr-2 text-brown-600" aria-hidden="true" />{' '}
              Recent Roasts
            </h2>
            <ul className="space-y-4">
              {recentRoasts?.map((roast) => (
                <li key={roast.id}>
                  <Link
                    href={`/roast-log/${roast.id}`}
                    className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500"
                  >
                    <div className="font-medium text-gray-800">
                      {roast.date.toLocaleDateString()}
                    </div>
                    <div className="text-gray-600">{roast.beanType}</div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaThermometerHalf className="mr-1" aria-hidden="true" />
                      <span className="sr-only">Roast profile:</span>{' '}
                      {roast.profile.name}
                      <FaWeightHanging
                        className="ml-4 mr-1"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Weight:</span> {roast.weight}g
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="low-stock-heading"
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2
              id="low-stock-heading"
              className="text-xl font-light mb-4 text-gray-800 flex items-center"
            >
              <CgDatabase className="mr-2 text-brown-600" aria-hidden="true" />{' '}
              Low Stock Alerts
            </h2>
            <ul className="space-y-4">
              {lowStockBeans?.map((bean) => (
                <li key={bean.id} className="bg-red-50 p-4 rounded-lg">
                  <div className="font-medium text-red-800">
                    {bean.origin} - {bean.variety}
                  </div>
                  <div className="text-red-600">
                    {bean.quantity}kg remaining
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <nav className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/roast-log/new"
            className="bg-brown-600 text-white font-light py-3 px-6 rounded-lg hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 flex items-center"
          >
            <CgCoffee className="mr-2" aria-hidden="true" /> New Roast Log
          </Link>
          <Link
            href="/roast-profile/new"
            className="bg-gray-200 text-gray-800 font-light py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center"
          >
            <CgNotes className="mr-2" aria-hidden="true" /> New Roast Profile
          </Link>
          <Link
            href="/green-bean/new"
            className="bg-green-600 text-white font-light py-3 px-6 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
          >
            <CgDatabase className="mr-2" aria-hidden="true" /> Add Green Beans
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default DashboardPage;
