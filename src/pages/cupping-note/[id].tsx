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
      router.push('/cupping-note');
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
    <div className="container mx-auto p-4 bg-blue-50">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">
        New Cupping Note
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roastLogId" className="block text-blue-800 mb-1">
            Roast Log ID
          </label>
          <input
            id="roastLogId"
            type="text"
            name="roastLogId"
            value={formData.roastLogId}
            onChange={handleChange}
            className="w-full p-2 border rounded text-blue-900 bg-white"
            required
          />
        </div>
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
            <label htmlFor={attribute} className="block text-blue-800 mb-1">
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            </label>
            <input
              id={attribute}
              type="number"
              name={attribute}
              value={formData[attribute as keyof typeof formData]}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full p-2 border rounded text-blue-900 bg-white"
              required
            />
          </div>
        ))}
        <div>
          <label htmlFor="notes" className="block text-blue-800 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded text-blue-900 bg-white"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Cupping Note
        </button>
      </form>
      <Link
        href="/cupping-note"
        className="mt-4 inline-block text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
      >
        Back to Cupping Notes
      </Link>
    </div>
  );
};

export default NewCuppingNote;
