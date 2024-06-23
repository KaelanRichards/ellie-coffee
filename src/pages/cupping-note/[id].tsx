import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NewCuppingNote = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roastLogId: '',
    aroma: 5,
    flavor: 5,
    aftertaste: 5,
    acidity: 5,
    body: 5,
    balance: 5,
    overall: 5,
    notes: '',
  });

  const createCuppingNote = trpc.cuppingNote.create.useMutation({
    onSuccess: () => {
      router.push('/cupping-notes');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value =
      e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCuppingNote.mutate(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Cupping Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="roastLogId"
          value={formData.roastLogId}
          onChange={handleChange}
          placeholder="Roast Log ID"
          className="w-full p-2 border rounded"
          required
        />
        {[
          'aroma',
          'flavor',
          'aftertaste',
          'acidity',
          'body',
          'balance',
          'overall',
        ].map((attribute) => (
          <div key={attribute}>
            <label className="block">
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            </label>
            <input
              type="number"
              name={attribute}
              value={formData[attribute as keyof typeof formData]}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Cupping Note
        </button>
      </form>
      <Link href="/cupping-notes" className="mt-4 text-blue-500">
        Back to Cupping Notes
      </Link>
    </div>
  );
};

export default NewCuppingNote;
