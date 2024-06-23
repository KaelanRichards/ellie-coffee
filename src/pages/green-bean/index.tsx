import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const GreenBeansPage = () => {
  const { data: greenBeans, isLoading } = trpc.greenBean.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Green Bean Inventory</h1>
      <Link href="/green-bean/new" className="btn btn-primary mb-4">
        Add New Green Bean
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {greenBeans?.map((bean) => (
          <div key={bean.id} className="border p-4 rounded">
            <Link href={`/green-bean/${bean.id}`}>
              <h2 className="text-xl font-semibold">
                {bean.origin} - {bean.variety}
              </h2>
              <p>Processing: {bean.processingMethod}</p>
              <p>Quantity: {bean.quantity}kg</p>
              <p>Purchased: {bean.purchaseDate.toLocaleDateString()}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GreenBeansPage;
