import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaLeaf, FaArrowLeft } from 'react-icons/fa';

const NewGreenBean = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    origin: '',
    variety: '',
    processingMethod: '',
    quantity: '',
    purchaseDate: '',
  });

  const createGreenBean = trpc.greenBean.create.useMutation({
    onSuccess: () => {
      router.push('/green-bean');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGreenBean.mutate({
      ...formData,
      quantity: parseFloat(formData.quantity),
      purchaseDate: new Date(formData.purchaseDate),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Link
          href="/green-bean"
          className="flex items-center text-green-600 hover:text-green-800 mb-8 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" aria-hidden="true" />
          <span>Back to Green Beans</span>
        </Link>
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <FaLeaf
              className="text-4xl text-green-600 mr-4"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Green Bean
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { name: 'origin', label: 'Origin', type: 'text' },
              { name: 'variety', label: 'Variety', type: 'text' },
              {
                name: 'processingMethod',
                label: 'Processing Method',
                type: 'text',
              },
              {
                name: 'quantity',
                label: 'Quantity (kg)',
                type: 'number',
                step: '0.1',
                min: '0',
              },
              { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  required
                  aria-required="true"
                  {...(field.step && { step: field.step })}
                  {...(field.min && { min: field.min })}
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out text-lg font-semibold"
            >
              Add Green Bean
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewGreenBean;
