import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaSave, FaArrowLeft } from 'react-icons/fa';

const GreenBeanPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: bean,
    isLoading,
    error,
  } = trpc.greenBean.getById.useQuery({
    id: id as string,
  });
  const updateBean = trpc.greenBean.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  const deleteGreenBean = trpc.greenBean.delete.useMutation({
    onSuccess: () => {
      router.push('/green-bean');
    },
  });

  const handleDelete = async () => {
    if (
      window.confirm('Are you sure you want to delete this green bean?') &&
      bean
    ) {
      await deleteGreenBean.mutateAsync({ id: bean.id });
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen" role="status">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brown-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-8 text-red-600" role="alert">
        Error: {error.message}
      </div>
    );
  if (!bean)
    return (
      <div className="text-center p-8" role="alert">
        Green bean not found
      </div>
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    const formData = new FormData(e.currentTarget);
    try {
      await updateBean.mutateAsync({
        id: bean.id,
        origin: formData.get('origin') as string,
        variety: formData.get('variety') as string,
        processingMethod: formData.get('processingMethod') as string,
        quantity: Number(formData.get('quantity')),
        purchaseDate: new Date(formData.get('purchaseDate') as string),
      });
      setIsEditing(false);
    } catch (error) {
      setFormError('Failed to update bean. Please try again.');
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <nav aria-label="Breadcrumb" className="mb-4">
        <Link
          href="/green-bean"
          className="inline-flex items-center text-brown-600 hover:text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 transition-colors"
        >
          <FaArrowLeft className="mr-2" aria-hidden="true" />
          <span>Back to Green Beans</span>
        </Link>
      </nav>
      <h1 className="text-3xl font-bold mb-6 text-brown-900">
        Green Bean Details
      </h1>
      <section aria-live="polite">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset>
              <legend className="sr-only">Green Bean Information</legend>
              {['origin', 'variety', 'processingMethod'].map((field) => (
                <div key={field} className="mb-4">
                  <label
                    htmlFor={field}
                    className="block mb-2 font-medium text-brown-700"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    defaultValue={bean[field as keyof typeof bean] as string}
                    className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
                    required
                  />
                </div>
              ))}
              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block mb-2 font-medium text-brown-700"
                >
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  defaultValue={bean.quantity}
                  className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="purchaseDate"
                  className="block mb-2 font-medium text-brown-700"
                >
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  defaultValue={bean.purchaseDate.toISOString().split('T')[0]}
                  className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
                  required
                />
              </div>
            </fieldset>
            {formError && (
              <p className="text-red-600 mb-4" role="alert">
                {formError}
              </p>
            )}
            <button
              type="submit"
              className="bg-brown-600 text-white px-4 py-2 rounded hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 inline-flex items-center transition-colors"
            >
              <FaSave className="mr-2" aria-hidden="true" />
              Save Changes
            </button>
          </form>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(bean).map(
                ([key, value]) =>
                  key !== 'id' && (
                    <div key={key}>
                      <dt className="font-medium text-brown-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </dt>
                      <dd className="mt-1 text-brown-900">
                        {key === 'purchaseDate'
                          ? new Date(value as string).toLocaleDateString()
                          : String(value)}
                      </dd>
                    </div>
                  ),
              )}
            </dl>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-brown-100 text-brown-800 px-4 py-2 rounded hover:bg-brown-200 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 inline-flex items-center transition-colors"
            >
              <FaEdit className="mr-2" aria-hidden="true" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default GreenBeanPage;
