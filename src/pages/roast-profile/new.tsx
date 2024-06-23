import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NewRoastProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    data: '',
  });

  const createRoastProfile = trpc.roastProfile.create.useMutation({
    onSuccess: () => {
      router.push('/roast-profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoastProfile.mutate({
      ...formData,
      data: JSON.parse(formData.data),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Roast Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Profile Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="data"
          value={formData.data}
          onChange={handleChange}
          placeholder="Profile Data (JSON)"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Create Roast Profile
        </button>
      </form>
      <Link href="/roast-profile" className="mt-4 text-blue-500">
        Back to Roast Profiles
      </Link>
    </div>
  );
};

export default NewRoastProfile;
