import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import RoastComparisonTool from '~/components/RoastComparisonTool';

const RoastComparisonPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-brown-600 hover:text-brown-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-6">Roast Comparison</h1>
      <RoastComparisonTool />
    </div>
  );
};

export default RoastComparisonPage;
