import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { FaCoffee, FaPlus, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

type SortField = 'date' | 'beanType' | 'profile';
type SortDirection = 'asc' | 'desc';

const RoastLogsPage = () => {
  const { data: roastLogs, isLoading } = trpc.roastLog.getAll.useQuery();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedLogs = useMemo(() => {
    if (!roastLogs) return [];
    return [...roastLogs].sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (sortField === 'beanType') {
        return sortDirection === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
      if (sortField === 'profile') {
        return sortDirection === 'asc'
          ? a[sortField].name.localeCompare(b[sortField].name)
          : b[sortField].name.localeCompare(a[sortField].name);
      }
      return 0;
    });
  }, [roastLogs, sortField, sortDirection]);

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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 flex items-center">
            <FaCoffee className="mr-3 text-brown-600" aria-hidden="true" />
            Roast Logs
          </h1>
          <Link
            href="/roast-log/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-colors"
          >
            <FaPlus className="mr-2" aria-hidden="true" />
            New Roast Log
          </Link>
        </header>
        {roastLogs && roastLogs.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader
                    field="date"
                    label="Date"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="beanType"
                    label="Bean Type"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="profile"
                    label="Profile"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cupping Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.date.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.beanType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.profile.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.cuppingNotes && log.cuppingNotes.length > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {log.cuppingNotes.length} note
                          {log.cuppingNotes.length !== 1 && 's'}
                        </span>
                      ) : (
                        <span className="text-gray-400">No notes</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/roast-log/${log.id}`}
                        className="text-brown-600 hover:text-brown-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            No roast logs found. Start by creating a new roast log.
          </p>
        )}
      </main>
    </div>
  );
};

interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentSort: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  label,
  currentSort,
  direction,
  onSort,
}) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    <button
      className="group inline-flex items-center focus:outline-none"
      onClick={() => onSort(field)}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <span className="ml-2">
        {field === currentSort ? (
          direction === 'asc' ? (
            <FaSortUp className="h-4 w-4 text-gray-400" aria-hidden="true" />
          ) : (
            <FaSortDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          )
        ) : (
          <FaSort
            className="h-4 w-4 text-gray-300 group-hover:text-gray-400"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  </th>
);

export default RoastLogsPage;
