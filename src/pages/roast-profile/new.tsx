import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCoffee, FaArrowLeft } from 'react-icons/fa';

interface FormData {
  name: string;
  temperatureReadings: string;
  firstCrack: string;
  developmentTime: string;
  totalRoastTime: string;
  chargeTemperature: string;
  endTemperature: string;
  notes: string;
}

const NewRoastProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    temperatureReadings: '',
    firstCrack: '',
    developmentTime: '',
    totalRoastTime: '',
    chargeTemperature: '',
    endTemperature: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const createRoastProfile = trpc.roastProfile.create.useMutation({
    onSuccess: () => {
      router.push('/roast-profile');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      createRoastProfile.mutate({
        name: formData.name,
        temperatureReadings: JSON.parse(formData.temperatureReadings),
        firstCrack: parseInt(formData.firstCrack) || undefined,
        developmentTime: parseInt(formData.developmentTime) || undefined,
        totalRoastTime: parseInt(formData.totalRoastTime) || undefined,
        chargeTemperature: parseInt(formData.chargeTemperature) || undefined,
        endTemperature: parseInt(formData.endTemperature) || undefined,
        notes: formData.notes,
      });
    } catch (err) {
      setError('Invalid JSON data. Please check your input.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/roast-profile"
        className="inline-flex items-center text-brown-600 hover:text-brown-800 mb-6"
      >
        <FaArrowLeft className="mr-2" aria-hidden="true" />
        Back to Roast Profiles
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-brown-900 flex items-center">
        <FaCoffee className="mr-3 text-brown-600" aria-hidden="true" />
        New Roast Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Profile Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Temperature Readings (JSON)"
          name="temperatureReadings"
          type="textarea"
          value={formData.temperatureReadings}
          onChange={handleChange}
          required
        />
        <FormField
          label="First Crack (seconds)"
          name="firstCrack"
          type="number"
          value={formData.firstCrack}
          onChange={handleChange}
        />
        <FormField
          label="Development Time (seconds)"
          name="developmentTime"
          type="number"
          value={formData.developmentTime}
          onChange={handleChange}
        />
        <FormField
          label="Total Roast Time (seconds)"
          name="totalRoastTime"
          type="number"
          value={formData.totalRoastTime}
          onChange={handleChange}
        />
        <FormField
          label="Charge Temperature (degrees)"
          name="chargeTemperature"
          type="number"
          value={formData.chargeTemperature}
          onChange={handleChange}
        />
        <FormField
          label="End Temperature (degrees)"
          name="endTemperature"
          type="number"
          value={formData.endTemperature}
          onChange={handleChange}
        />
        <FormField
          label="Notes"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={handleChange}
        />
        {error && (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-brown-600 text-white p-3 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          disabled={createRoastProfile.status === 'pending'}
        >
          {createRoastProfile.status === 'pending'
            ? 'Creating...'
            : 'Create Roast Profile'}
        </button>
      </form>
    </main>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
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
    <label
      htmlFor={name}
      className="block text-sm font-medium text-brown-700 mb-1"
    >
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-brown-300 rounded-md shadow-sm focus:ring-brown-500 focus:border-brown-500 text-brown-900"
        rows={6}
        required={required}
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-brown-300 rounded-md shadow-sm focus:ring-brown-500 focus:border-brown-500 text-brown-900"
        required={required}
      />
    )}
  </div>
);

export default NewRoastProfile;
