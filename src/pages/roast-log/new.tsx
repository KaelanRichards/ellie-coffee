import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCoffee, FaArrowLeft } from 'react-icons/fa';
import EquipmentForm from '~/components/EquipmentForm';
import ExperimentForm from '~/components/ExperimentForm';

const NewRoastLog = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    beanType: '',
    profileId: '',
    equipment: '',
    notes: '',
    weight: '',
    equipmentId: '',
    experimentId: '',
  });

  const createRoastLog = trpc.roastLog.create.useMutation({
    onSuccess: () => {
      router.push('/roast-log');
    },
  });

  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [showExperimentForm, setShowExperimentForm] = useState(false);

  const { data: equipment } = trpc.equipment.getAll.useQuery();
  const { data: experiments } = trpc.experiment.getAll.useQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoastLog.mutate({
      ...formData,
      date: new Date(formData.date),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
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
              name="equipmentId"
              type="select"
              value={formData.equipmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Equipment</option>
              {equipment?.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name}
                </option>
              ))}
            </FormField>
            <button
              type="button"
              onClick={() => setShowEquipmentForm(true)}
              className="text-brown-600 hover:text-brown-800"
            >
              Add New Equipment
            </button>
            <FormField
              label="Experiment"
              name="experimentId"
              type="select"
              value={formData.experimentId}
              onChange={handleChange}
            >
              <option value="">Select Experiment (Optional)</option>
              {experiments?.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.name}
                </option>
              ))}
            </FormField>
            <button
              type="button"
              onClick={() => setShowExperimentForm(true)}
              className="text-brown-600 hover:text-brown-800"
            >
              Create New Experiment
            </button>
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
      {showEquipmentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-lg font-bold mb-4">Add New Equipment</h2>
            <EquipmentForm
              onSubmit={() => {
                setShowEquipmentForm(false);
              }}
            />
            <button
              onClick={() => setShowEquipmentForm(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showExperimentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-lg font-bold mb-4">Create New Experiment</h2>
            <ExperimentForm
              onSubmit={() => {
                setShowExperimentForm(false);
              }}
            />
            <button
              onClick={() => setShowExperimentForm(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  required?: boolean;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  required,
  children,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    {type === 'select' ? (
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-500 focus:border-brown-500"
      >
        {children}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-500 focus:border-brown-500"
      />
    )}
  </div>
);

export default NewRoastLog;
