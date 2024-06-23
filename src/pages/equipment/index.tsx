import React from 'react';
import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { FaPlus, FaTools } from 'react-icons/fa';
import LoadingSpinner from '~/components/LoadingSpinner';

const EquipmentPage = () => {
  const { data: equipment, isLoading } = trpc.equipment.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <FaTools className="mr-2" />
        Equipment Management
      </h1>
      <Link
        href="/equipment/new"
        className="bg-brown-600 text-white px-4 py-2 rounded hover:bg-brown-700 inline-flex items-center mb-6"
      >
        <FaPlus className="mr-2" />
        Add New Equipment
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment?.map((eq) => (
          <div key={eq.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{eq.name}</h2>
            <p className="text-gray-600 mb-2">{eq.type}</p>
            <p className="text-gray-600 mb-2">
              {eq.manufacturer} - {eq.model}
            </p>
            <p className="text-gray-600 mb-2">
              Purchased: {new Date(eq.purchaseDate).toLocaleDateString()}
            </p>
            <Link
              href={`/equipment/${eq.id}`}
              className="text-brown-600 hover:text-brown-800"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentPage;
