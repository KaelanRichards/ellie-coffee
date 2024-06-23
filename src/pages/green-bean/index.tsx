import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { FaPlus, FaLeaf } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const GreenBeansPage = () => {
  const { data: greenBeans, isLoading } = trpc.greenBean.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaLeaf className="mr-3 text-green-600" aria-hidden="true" />
            Green Bean Inventory
          </h1>
        </header>

        <Link
          href="/green-bean/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors mb-8"
        >
          <FaPlus className="mr-2" aria-hidden="true" />
          Add New Green Bean
        </Link>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {greenBeans?.map((bean) => (
            <article
              key={bean.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <Link href={`/green-bean/${bean.id}`} className="block p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {bean.origin} - {bean.variety}
                </h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Processing
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {bean.processingMethod}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Quantity
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {bean.quantity}kg
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Purchased
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {bean.purchaseDate.toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GreenBeansPage;
