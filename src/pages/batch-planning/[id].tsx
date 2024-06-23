import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const BatchPlanDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: batchPlan, isLoading } = trpc.batchPlanning.getById.useQuery({
    id: id as string,
  });
  const { data: greenBeanRequirement } =
    trpc.batchPlanning.calculateGreenBeanRequirement.useQuery({
      batchPlanId: id as string,
    });

  if (isLoading) return <LoadingSpinner />;

  if (!batchPlan) {
    return <div>Batch plan not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/batch-planning"
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back to Batch Planning
      </Link>
      <h1 className="text-3xl font-bold mb-6">Batch Plan Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {batchPlan.roastProfile.name} - {batchPlan.greenBean.origin}
        </h2>
        <p className="text-gray-600">
          Scheduled Date:{' '}
          {new Date(batchPlan.scheduledDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600">Batch Size: {batchPlan.batchSize} kg</p>
        <h3 className="text-lg font-semibold mt-6 mb-2">
          Green Bean Requirement
        </h3>
        {greenBeanRequirement && (
          <div>
            <p className="text-gray-600">
              Required Amount: {greenBeanRequirement.required.toFixed(2)} kg
            </p>
            <p className="text-gray-600">
              Available Amount: {greenBeanRequirement.available.toFixed(2)} kg
            </p>
            <p
              className={`font-semibold ${
                greenBeanRequirement.sufficient
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {greenBeanRequirement.sufficient
                ? 'Sufficient green beans available'
                : 'Insufficient green beans'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchPlanDetailPage;
