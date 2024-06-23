import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { FaPlus, FaCoffee } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const RoastProfilesPage = () => {
  const { data: profiles, isLoading } = trpc.roastProfile.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Roast Profiles
          </h1>
          <p className="text-gray-600">Manage your coffee roasting profiles</p>
        </header>

        <Link
          href="/roast-profile/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 mb-6"
        >
          <FaPlus className="mr-2" aria-hidden="true" />
          New Roast Profile
        </Link>

        {profiles && profiles.length > 0 ? (
          <ul
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {profiles.map((profile) => (
              <li
                key={profile.id}
                className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
              >
                <Link
                  href={`/roast-profile/${profile.id}`}
                  className="flex flex-col h-full"
                >
                  <div className="flex-1 flex flex-col p-8">
                    <FaCoffee
                      className="w-12 h-12 flex-shrink-0 text-brown-400 mb-4"
                      aria-hidden="true"
                    />
                    <h2 className="mt-2 text-xl font-medium text-gray-900">
                      {profile.name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Created on{' '}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="flex justify-end p-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-brown-100 text-brown-800">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaCoffee
              className="mx-auto h-12 w-12 text-gray-400"
              aria-hidden="true"
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No roast profiles
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new roast profile.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoastProfilesPage;
