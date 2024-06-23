import React from 'react';
import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { FaPlus, FaFlask } from 'react-icons/fa';
import LoadingSpinner from '~/components/LoadingSpinner';

const ExperimentsPage = () => {
  const { data: experiments, isLoading } = trpc.experiment.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <FaFlask className="mr-2" />
        Roasting Experiments
      </h1>
      <Link
        href="/experiment/new"
        className="bg-brown-600 text-white px-4 py-2 rounded hover:bg-brown-700 inline-flex items-center mb-6"
      >
        <FaPlus className="mr-2" />
        Create New Experiment
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments?.map((exp) => (
          <div key={exp.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{exp.name}</h2>
            <p className="text-gray-600 mb-2">Status: {exp.status}</p>
            <p className="text-gray-600 mb-2">
              Started: {new Date(exp.startDate).toLocaleDateString()}
            </p>
            {exp.endDate && (
              <p className="text-gray-600 mb-2">
                Ended: {new Date(exp.endDate).toLocaleDateString()}
              </p>
            )}
            <Link
              href={`/experiment/${exp.id}`}
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

export default ExperimentsPage;
