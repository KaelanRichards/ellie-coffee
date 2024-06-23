import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const RoastProfilesPage = () => {
  const { data: profiles, isLoading } = trpc.roastProfile.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Roast Profiles</h1>
      <Link href="/roast-profile/new" className="btn btn-primary mb-4">
        New Roast Profile
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles?.map((profile) => (
          <div key={profile.id} className="border p-4 rounded">
            <Link href={`/roast-profile/${profile.id}`}>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              {/* Add a visual representation of the roast curve here */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoastProfilesPage;
