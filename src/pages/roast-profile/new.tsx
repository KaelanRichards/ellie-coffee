import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCoffee, FaArrowLeft } from 'react-icons/fa';

const NewRoastProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    data: '',
  });
  const [error, setError] = useState('');

  const createRoastProfile = trpc.roastProfile.create.useMutation({
    onSuccess: () => {
      router.push('/roast-profile');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      createRoastProfile.mutate({
        ...formData,
        data: JSON.parse(formData.data),
      });
    } catch (err) {
      setError('Invalid JSON data. Please check your input.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/roast-profile"
        className="inline-flex items-center text-brown-600 hover:text-brown-800 mb-6"
      >
        <FaArrowLeft className="mr-2" aria-hidden="true" />
        Back to Roast Profiles
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-brown-900 flex items-center">
        <FaCoffee className="mr-3 text-brown-600" aria-hidden="true" />
        New Roast Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-brown-700 mb-1"
            >
              Profile Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-brown-300 rounded-md shadow-sm focus:ring-brown-500 focus:border-brown-500 text-brown-900"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="data"
              className="block text-sm font-medium text-brown-700 mb-1"
            >
              Profile Data (JSON)
            </label>
            <textarea
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full p-2 border border-brown-300 rounded-md shadow-sm focus:ring-brown-500 focus:border-brown-500 text-brown-900"
              rows={6}
              required
              aria-required="true"
            />
          </div>
        </div>
        {error && (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-brown-600 text-white p-3 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          disabled={createRoastProfile.status === 'pending'}
        >
          {createRoastProfile.status === 'pending'
            ? 'Creating...'
            : 'Create Roast Profile'}
        </button>
      </form>
    </main>
  );
};

export default NewRoastProfile;
