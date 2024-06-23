import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NewRoastLog = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    beanType: '',
    profileId: '',
    equipment: '',
    notes: '',
  });

  const createRoastLog = trpc.roastLog.create.useMutation({
    onSuccess: () => {
      router.push('/roast-log');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoastLog.mutate({
      ...formData,
      date: new Date(formData.date),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Roast Log</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="beanType"
          value={formData.beanType}
          onChange={handleChange}
          placeholder="Bean Type"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="profileId"
          value={formData.profileId}
          onChange={handleChange}
          placeholder="Profile ID"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="equipment"
          value={formData.equipment}
          onChange={handleChange}
          placeholder="Equipment"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Roast Log
        </button>
      </form>
      <Link href="/roast-log" className="mt-4 text-blue-500">
        Back to Roast Logs
      </Link>
    </div>
  );
};

export default NewRoastLog;
