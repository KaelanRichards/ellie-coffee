import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';
import { FaCalendarAlt, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const BatchPlanningPage = () => {
  const {
    data: batchPlans,
    isLoading,
    refetch,
  } = trpc.batchPlanning.getAll.useQuery();
  const createBatchPlan = trpc.batchPlanning.create.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteBatchPlan = trpc.batchPlanning.delete.useMutation({
    onSuccess: () => refetch(),
  });
  const { data: roastProfiles } = trpc.roastProfile.getAll.useQuery();
  const { data: greenBeans } = trpc.greenBean.getAll.useQuery();

  const [newBatchPlan, setNewBatchPlan] = useState({
    scheduledDate: '',
    roastProfileId: '',
    greenBeanId: '',
    batchSize: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setNewBatchPlan({ ...newBatchPlan, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBatchPlan.mutate({
      ...newBatchPlan,
      scheduledDate: new Date(newBatchPlan.scheduledDate),
      batchSize: Number(newBatchPlan.batchSize),
    });
    setNewBatchPlan({
      scheduledDate: '',
      roastProfileId: '',
      greenBeanId: '',
      batchSize: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch plan?')) {
      deleteBatchPlan.mutate({ id });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Batch Planning</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Batch Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="scheduledDate"
              className="block text-sm font-medium text-gray-700"
            >
              Scheduled Date
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={newBatchPlan.scheduledDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="roastProfileId"
              className="block text-sm font-medium text-gray-700"
            >
              Roast Profile
            </label>
            <select
              id="roastProfileId"
              name="roastProfileId"
              value={newBatchPlan.roastProfileId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select a roast profile</option>
              {roastProfiles?.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="greenBeanId"
              className="block text-sm font-medium text-gray-700"
            >
              Green Bean
            </label>
            <select
              id="greenBeanId"
              name="greenBeanId"
              value={newBatchPlan.greenBeanId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select a green bean</option>
              {greenBeans?.map((bean) => (
                <option key={bean.id} value={bean.id}>
                  {bean.origin} - {bean.variety}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="batchSize"
              className="block text-sm font-medium text-gray-700"
            >
              Batch Size (kg)
            </label>
            <input
              type="number"
              id="batchSize"
              name="batchSize"
              value={newBatchPlan.batchSize}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Batch Plan
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Scheduled Batches</h2>
      {batchPlans && batchPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchPlans.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {plan.roastProfile.name} - {plan.greenBean.origin}
                </h3>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Delete batch plan"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="text-gray-600">
                <FaCalendarAlt className="inline-block mr-2" />
                {new Date(plan.scheduledDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Batch Size: {plan.batchSize} kg</p>
              <Link
                href={`/batch-planning/${plan.id}`}
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No batch plans scheduled yet.</p>
      )}
    </div>
  );
};

export default BatchPlanningPage;
