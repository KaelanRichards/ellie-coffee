import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCoffee, FaArrowLeft } from 'react-icons/fa';

const NewRoastLog = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    beanType: '',
    profileId: '',
    equipment: '',
    notes: '',
    weight: '',
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
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Link
          href="/roast-log"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Roast Logs
        </Link>
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <FaCoffee className="text-4xl text-brown-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">New Roast Log</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <FormField
              label="Bean Type"
              name="beanType"
              type="text"
              value={formData.beanType}
              onChange={handleChange}
              required
            />
            <FormField
              label="Profile ID"
              name="profileId"
              type="text"
              value={formData.profileId}
              onChange={handleChange}
              required
            />
            <FormField
              label="Equipment"
              name="equipment"
              type="text"
              value={formData.equipment}
              onChange={handleChange}
              required
            />
            <FormField
              label="Weight (g)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
            />
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-500 focus:border-brown-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
            >
              Create Roast Log
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  required,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-500 focus:border-brown-500"
    />
  </div>
);

export default NewRoastLog;
