import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';

const GreenBeanPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: bean, isLoading } = trpc.greenBean.getById.useQuery({
    id: id as string,
  });
  const updateBean = trpc.greenBean.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!bean) return <div>Green bean not found</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateBean.mutateAsync({
      id: bean.id,
      origin: formData.get('origin') as string,
      variety: formData.get('variety') as string,
      processingMethod: formData.get('processingMethod') as string,
      quantity: Number(formData.get('quantity')),
      purchaseDate: new Date(formData.get('purchaseDate') as string),
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/green-bean" className="btn btn-secondary mb-4">
        Back to Green Beans
      </Link>
      <h1 className="text-3xl font-bold mb-4">Green Bean Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Origin</label>
            <input
              type="text"
              name="origin"
              defaultValue={bean.origin}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Variety</label>
            <input
              type="text"
              name="variety"
              defaultValue={bean.variety}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Processing Method</label>
            <input
              type="text"
              name="processingMethod"
              defaultValue={bean.processingMethod}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Quantity (kg)</label>
            <input
              type="number"
              name="quantity"
              defaultValue={bean.quantity}
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              defaultValue={bean.purchaseDate.toISOString().split('T')[0]}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>Origin: {bean.origin}</p>
          <p>Variety: {bean.variety}</p>
          <p>Processing Method: {bean.processingMethod}</p>
          <p>Quantity: {bean.quantity}kg</p>
          <p>Purchase Date: {bean.purchaseDate.toLocaleDateString()}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary mt-4"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default GreenBeanPage;
