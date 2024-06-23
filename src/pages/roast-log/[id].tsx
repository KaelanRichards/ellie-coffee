import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';

const RoastLogPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: roastLog, isLoading } = trpc.roastLog.getById.useQuery({
    id: id as string,
  });
  const updateRoastLog = trpc.roastLog.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!roastLog) return <div>Roast log not found</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateRoastLog.mutateAsync({
      id: roastLog.id,
      date: new Date(formData.get('date') as string),
      beanType: formData.get('beanType') as string,
      profileId: formData.get('profileId') as string,
      equipment: formData.get('equipment') as string,
      notes: formData.get('notes') as string,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/roast-log" className="btn btn-secondary mb-4">
        Back to Roast Logs
      </Link>
      <h1 className="text-3xl font-bold mb-4">Roast Log Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={roastLog.date.toISOString().split('T')[0]}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Bean Type</label>
            <input
              type="text"
              name="beanType"
              defaultValue={roastLog.beanType}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Profile</label>
            <input
              type="text"
              name="profileId"
              defaultValue={roastLog.profileId}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Equipment</label>
            <input
              type="text"
              name="equipment"
              defaultValue={roastLog.equipment}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Notes</label>
            <textarea
              name="notes"
              defaultValue={roastLog.notes ?? ''}
              className="textarea"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>Date: {roastLog.date.toLocaleDateString()}</p>
          <p>Bean Type: {roastLog.beanType}</p>
          <p>Profile: {roastLog.profile.name}</p>
          <p>Equipment: {roastLog.equipment}</p>
          <p>Notes: {roastLog.notes}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary mt-4"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default RoastLogPage;
