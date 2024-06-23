import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { FaPlus, FaLeaf, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useState, useMemo } from 'react';

type SortField =
  | 'origin'
  | 'variety'
  | 'processingMethod'
  | 'quantity'
  | 'purchaseDate';
type SortDirection = 'asc' | 'desc';

const GreenBeansPage = () => {
  const { data: greenBeans, isLoading } = trpc.greenBean.getAll.useQuery();
  const [sortField, setSortField] = useState<SortField>('purchaseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedBeans = useMemo(() => {
    if (!greenBeans) return [];
    return [...greenBeans].sort((a, b) => {
      if (sortField === 'purchaseDate') {
        return sortDirection === 'asc'
          ? a.purchaseDate.getTime() - b.purchaseDate.getTime()
          : b.purchaseDate.getTime() - a.purchaseDate.getTime();
      }
      if (sortField === 'quantity') {
        return sortDirection === 'asc'
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      }
      // For string fields
      if (['origin', 'variety', 'processingMethod'].includes(sortField)) {
        return sortDirection === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
      // Fallback for any other fields
      return 0;
    });
  }, [greenBeans, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaLeaf className="mr-3 text-green-600" aria-hidden="true" />
            Green Bean Inventory
          </h1>
        </header>

        <Link
          href="/green-bean/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors mb-8"
        >
          <FaPlus className="mr-2" aria-hidden="true" />
          Add New Green Bean
        </Link>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Origin',
                  'Variety',
                  'Processing Method',
                  'Quantity',
                  'Purchase Date',
                ].map((header, index) => (
                  <SortableHeader
                    key={index}
                    label={header}
                    field={header.toLowerCase().replace(' ', '') as SortField}
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                ))}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBeans.map((bean) => (
                <tr key={bean.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bean.origin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bean.variety}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bean.processingMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bean.quantity}kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bean.purchaseDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/green-bean/${bean.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  field,
  currentSort,
  direction,
  onSort,
}) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    <button
      className="group inline-flex items-center"
      onClick={() => onSort(field)}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
        {field === currentSort ? (
          direction === 'desc' ? (
            <FaSortDown className="h-5 w-5" aria-hidden="true" />
          ) : (
            <FaSortUp className="h-5 w-5" aria-hidden="true" />
          )
        ) : (
          <FaSort className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
    </button>
  </th>
);

export default GreenBeansPage;
