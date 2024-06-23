import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NewCuppingNote = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roastLogId: '',
    aroma: '',
    flavor: '',
    aftertaste: '',
    acidity: '',
    body: '',
    balance: '',
    overall: '',
    notes: '',
  });

  const { data: roastLogs } = trpc.roastLog.getAll.useQuery();

  const createCuppingNote = trpc.cuppingNote.create.useMutation({
    onSuccess: () => {
      router.push('/cupping-note');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCuppingNote.mutate({
      ...formData,
      aroma: parseFloat(formData.aroma),
      flavor: parseFloat(formData.flavor),
      aftertaste: parseFloat(formData.aftertaste),
      acidity: parseFloat(formData.acidity),
      body: parseFloat(formData.body),
      balance: parseFloat(formData.balance),
      overall: parseFloat(formData.overall),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 bg-blue-50">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">
        New Cupping Note
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roastLogId" className="block text-blue-800 mb-1">
            Roast Log
          </label>
          <select
            id="roastLogId"
            name="roastLogId"
            value={formData.roastLogId}
            onChange={handleChange}
            className="w-full p-2 border rounded text-blue-900 bg-white"
            required
          >
            <option value="">Select a Roast Log</option>
            {roastLogs?.map((log) => (
              <option key={log.id} value={log.id}>
                {log.date.toLocaleDateString()} - {log.beanType}
              </option>
            ))}
          </select>
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
              className="w-full p-2 border rounded text-blue-900 bg-white"
              step="0.1"
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
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
