import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '~/components/LoadingSpinner';
import ExperimentForm from '~/components/ExperimentForm';

const ExperimentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: experiment, isLoading } = trpc.experiment.getById.useQuery({
    id: id as string,
  });
  const deleteExperiment = trpc.experiment.delete.useMutation({
    onSuccess: () => {
      router.push('/experiment');
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!experiment) return <div>Experiment not found</div>;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      await deleteExperiment.mutateAsync({ id: experiment.id });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link
          href="/experiment"
          className="flex items-center text-brown-600 hover:text-brown-800"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Experiments</span>
        </Link>
      </nav>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{experiment.name}</h1>
          {isEditing ? (
            <ExperimentForm
              experiment={experiment}
              onSubmit={() => {
                setIsEditing(false);
                router.reload();
              }}
            />
          ) : (
            <>
              <p className="text-gray-600 mb-4">{experiment.description}</p>
              <p className="mb-2">
                <strong>Start Date:</strong>{' '}
                {new Date(experiment.startDate).toLocaleDateString()}
              </p>
              {experiment.endDate && (
                <p className="mb-2">
                  <strong>End Date:</strong>{' '}
                  {new Date(experiment.endDate).toLocaleDateString()}
                </p>
              )}
              <p className="mb-2">
                <strong>Status:</strong> {experiment.status}
              </p>
              {experiment.notes && (
                <p className="mb-4">
                  <strong>Notes:</strong> {experiment.notes}
                </p>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  <FaTrash className="inline mr-2" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentPage;
