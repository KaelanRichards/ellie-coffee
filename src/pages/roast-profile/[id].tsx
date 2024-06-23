import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';

const RoastProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: profile, isLoading } = trpc.roastProfile.getById.useQuery({
    id: id as string,
  });
  const updateProfile = trpc.roastProfile.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

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
    <div className="container mx-auto p-4">
      <Link href="/roast-profile" className="btn btn-secondary mb-4">
        Back to Profiles
      </Link>
      <h1 className="text-3xl font-bold mb-4">Roast Profile Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={profile.name}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Data (JSON)</label>
            <textarea
              name="data"
              defaultValue={JSON.stringify(profile.data)}
              className="textarea"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>Name: {profile.name}</p>
          <p>Data: {JSON.stringify(profile.data)}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary mt-4"
          >
            Edit
          </button>
        </div>
      )}
      {/* Add a visual representation of the roast curve here */}
    </div>
  );
};

export default RoastProfilePage;
