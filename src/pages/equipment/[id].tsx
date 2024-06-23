import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaArrowLeft, FaTrash, FaTools } from 'react-icons/fa';
import LoadingSpinner from '~/components/LoadingSpinner';
import EquipmentForm from '~/components/EquipmentForm';

const EquipmentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: equipment, isLoading } = trpc.equipment.getById.useQuery({
    id: id as string,
  });
  const deleteEquipment = trpc.equipment.delete.useMutation({
    onSuccess: () => {
      router.push('/equipment');
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!equipment) return <div>Equipment not found</div>;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      await deleteEquipment.mutateAsync({ id: equipment.id });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/equipment"
            className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" aria-hidden="true" />
            <span>Back to Equipment</span>
          </Link>
        </nav>

        <main>
          <h1 className="text-4xl font-bold mb-6 text-brown-900 flex items-center">
            <FaTools className="mr-3 text-brown-600" aria-hidden="true" />
            Equipment Details
          </h1>

          <article className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              {isEditing ? (
                <EquipmentForm
                  equipment={equipment}
                  onSubmit={() => {
                    setIsEditing(false);
                    router.reload();
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <EquipmentDetail label="Name" value={equipment.name} />
                  <EquipmentDetail label="Type" value={equipment.type} />
                  <EquipmentDetail
                    label="Manufacturer"
                    value={equipment.manufacturer}
                  />
                  <EquipmentDetail label="Model" value={equipment.model} />
                  <EquipmentDetail
                    label="Serial Number"
                    value={equipment.serialNumber ?? 'N/A'}
                  />
                  <EquipmentDetail
                    label="Purchase Date"
                    value={new Date(
                      equipment.purchaseDate,
                    ).toLocaleDateString()}
                  />
                  <EquipmentDetail
                    label="Last Maintenance"
                    value={
                      equipment.lastMaintenance
                        ? new Date(
                            equipment.lastMaintenance,
                          ).toLocaleDateString()
                        : 'N/A'
                    }
                  />
                  <EquipmentDetail
                    label="Next Maintenance"
                    value={
                      equipment.nextMaintenance
                        ? new Date(
                            equipment.nextMaintenance,
                          ).toLocaleDateString()
                        : 'N/A'
                    }
                  />
                  <EquipmentDetail
                    label="Notes"
                    value={equipment.notes ?? 'N/A'}
                  />
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brown-700 bg-brown-100 hover:bg-brown-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
              >
                {isEditing ? (
                  'Cancel'
                ) : (
                  <>
                    <FaEdit className="mr-2" aria-hidden="true" />
                    Edit
                  </>
                )}
              </button>
              <button
                onClick={handleDelete}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                aria-label="Delete equipment"
              >
                <FaTrash className="mr-2" aria-hidden="true" />
                Delete
              </button>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

interface EquipmentDetailProps {
  label: string;
  value: string;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ label, value }) => (
  <div>
    <h3 className="text-lg font-medium text-brown-900">{label}</h3>
    <p className="mt-1 text-sm text-brown-500">{value}</p>
  </div>
);

export default EquipmentPage;
