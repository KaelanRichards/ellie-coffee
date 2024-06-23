import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaSave, FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const RoastProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: profile, isLoading } = trpc.roastProfile.getById.useQuery({
    id: id as string,
  });
  const updateProfile = trpc.roastProfile.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return <div role="alert">Profile not found</div>;

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
    <div className="container mx-auto p-4 max-w-2xl">
      <nav className="mb-8">
        <Link
          href="/roast-profile"
          className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" aria-hidden="true" />
          <span>Back to Profiles</span>
        </Link>
      </nav>
      <main>
        <h1 className="text-3xl font-bold mb-6 text-brown-900">
          Roast Profile Details
        </h1>
        <section
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          aria-labelledby="profile-details"
        >
          <h2 id="profile-details" className="sr-only">
            Profile Information
          </h2>
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-brown-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={profile.name}
                      className="w-full p-2 border border-brown-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="data"
                      className="block text-sm font-medium text-brown-700 mb-1"
                    >
                      Data (JSON)
                    </label>
                    <textarea
                      id="data"
                      name="data"
                      defaultValue={JSON.stringify(profile.data, null, 2)}
                      className="w-full p-2 border border-brown-300 rounded-md focus:ring-brown-500 focus:border-brown-500 font-mono"
                      rows={10}
                      required
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                  >
                    <FaSave className="mr-2" aria-hidden="true" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-brown-900">Name</h3>
                  <p className="mt-1 text-sm text-brown-500">{profile.name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-brown-900">
                    Profile Data
                  </h3>
                  <pre className="mt-1 text-sm text-brown-500 bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(profile.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brown-700 bg-brown-100 hover:bg-brown-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
            >
              {isEditing ? (
                'Cancel'
              ) : (
                <>
                  <FaEdit className="mr-2" aria-hidden="true" />
                  Edit
                </>
              )}
            </button>
          </div>
        </section>
        {/* Add a visual representation of the roast curve here */}
      </main>
    </div>
  );
};

export default RoastProfilePage;
