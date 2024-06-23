import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { FaPlus, FaCoffee, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useState } from 'react';
import RoastCurveChart from '~/components/RoastCurveChart';

// Add this type definition
type TemperatureReading = {
  time: number;
  temperature: number;
};

// Update the RoastCurveChartProps interface
interface RoastCurveChartProps {
  temperatureReadings: TemperatureReading[];
  firstCrack?: number;
  developmentTime?: number;
}

const RoastProfilesPage = () => {
  const {
    data: profiles,
    isLoading,
    refetch,
  } = trpc.roastProfile.getAll.useQuery();
  const deleteProfile = trpc.roastProfile.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this roast profile?')) {
      await deleteProfile.mutateAsync({ id });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <FaCoffee className="mr-4 text-brown-600" aria-hidden="true" />
            Roast Profiles
          </h1>
          <p className="text-xl text-gray-600">
            Manage your coffee roasting profiles
          </p>
        </header>

        <Link
          href="/roast-profile/new"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-colors duration-200 mb-8"
        >
          <FaPlus className="mr-2" aria-hidden="true" />
          New Roast Profile
        </Link>

        {profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white shadow-xl rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Created on{' '}
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <Link
                      href={`/roast-profile/${profile.id}`}
                      className="text-brown-600 hover:text-brown-900 transition-colors duration-200"
                    >
                      View Details
                    </Link>
                    <div>
                      <Link
                        href={`/roast-profile/${profile.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        <FaEdit aria-hidden="true" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash aria-hidden="true" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedProfile(
                        expandedProfile === profile.id ? null : profile.id,
                      )
                    }
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {expandedProfile === profile.id
                      ? 'Hide Details'
                      : 'Show Details'}
                  </button>
                  {expandedProfile === profile.id && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(profile, null, 2)}
                      </pre>
                    </div>
                  )}
                  {profile.temperatureReadings && (
                    <section className="mt-8" aria-labelledby="roast-curve">
                      <h2
                        id="roast-curve"
                        className="text-2xl font-bold mb-4 text-brown-900"
                      >
                        Roast Curve
                      </h2>
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                        <RoastCurveChart data={formatChartData(profile)} />
                      </div>
                    </section>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaCoffee
              className="mx-auto h-12 w-12 text-gray-400"
              aria-hidden="true"
            />
            <h2 className="mt-2 text-lg font-medium text-gray-900">
              No roast profiles
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new roast profile.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const formatChartData = (profile: any): RoastCurveChartProps => {
  if (!Array.isArray(profile.temperatureReadings)) {
    return { temperatureReadings: [] };
  }

  return {
    temperatureReadings: profile.temperatureReadings.map((reading: any) => ({
      time: Number(reading.time) || 0,
      temperature: Number(reading.temperature) || 0,
    })),
    firstCrack: profile.firstCrack,
    developmentTime: profile.developmentTime,
  };
};

export default RoastProfilesPage;
