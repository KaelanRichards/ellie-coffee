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

  const createCuppingNote = trpc.cuppingNote.create.useMutation({
    onSuccess: () => {
      router.push('/cupping-note');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCuppingNote.mutate({
      ...formData,
      aroma: parseInt(formData.aroma),
      flavor: parseInt(formData.flavor),
      aftertaste: parseInt(formData.aftertaste),
      acidity: parseInt(formData.acidity),
      body: parseInt(formData.body),
      balance: parseInt(formData.balance),
      overall: parseInt(formData.overall),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <input
            key={attribute}
            type="number"
            name={attribute}
            value={formData[attribute as keyof typeof formData]}
            onChange={handleChange}
            placeholder={attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            className="w-full p-2 border rounded"
            min="0"
            max="10"
            required
          />
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
      <Link href="/cupping-note" className="mt-4 text-blue-500">
        Back to Cupping Notes
      </Link>
    </div>
  );
};

export default NewCuppingNote;
