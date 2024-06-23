import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Green Bean</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          placeholder="Origin"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="variety"
          value={formData.variety}
          onChange={handleChange}
          placeholder="Variety"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="processingMethod"
          value={formData.processingMethod}
          onChange={handleChange}
          placeholder="Processing Method"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-yellow-500 text-white p-2 rounded">
          Add Green Bean
        </button>
      </form>
      <Link href="/green-bean" className="mt-4 text-blue-500">
        Back to Green Beans
      </Link>
    </div>
  );
};

export default NewGreenBean;
