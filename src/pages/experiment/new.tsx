import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaFlask, FaArrowLeft } from 'react-icons/fa';
import ExperimentForm from '~/components/ExperimentForm';

const NewExperimentPage = () => {
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/experiment');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Link
          href="/experiment"
          className="flex items-center text-brown-600 hover:text-brown-800 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Experiments
        </Link>
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <FaFlask className="text-4xl text-brown-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">New Experiment</h1>
          </div>
          <ExperimentForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default NewExperimentPage;
