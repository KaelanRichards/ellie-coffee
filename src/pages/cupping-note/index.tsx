import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { FaCoffee, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

type SortField =
  | 'date'
  | 'overall'
  | 'aroma'
  | 'flavor'
  | 'aftertaste'
  | 'acidity'
  | 'body'
  | 'balance';

const CuppingNotesPage = () => {
  const { data: cuppingNotes, isLoading } = trpc.cuppingNote.getAll.useQuery();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedNotes = useMemo(() => {
    if (!cuppingNotes) return [];
    return [...cuppingNotes].sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? a.roastLog.date.getTime() - b.roastLog.date.getTime()
          : b.roastLog.date.getTime() - a.roastLog.date.getTime();
      }
      return sortDirection === 'asc'
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    });
  }, [cuppingNotes, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-10" aria-live="polite">
        Loading...
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            <FaCoffee className="mr-4 text-brown-600" aria-hidden="true" />
            Cupping Notes
          </h1>
          <Link
            href="/cupping-note/new"
            className="bg-brown-600 hover:bg-brown-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2"
          >
            New Cupping Note
          </Link>
        </header>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <SortableHeader
                    field="date"
                    label="Date"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Bean
                  </th>
                  <SortableHeader
                    field="aroma"
                    label="Aroma"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="flavor"
                    label="Flavor"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="aftertaste"
                    label="Aftertaste"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="acidity"
                    label="Acidity"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="body"
                    label="Body"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="balance"
                    label="Balance"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="overall"
                    label="Overall"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {note.roastLog.date.toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {note.roastLog.beanType}
                    </td>
                    <ScoreCell score={note.aroma} />
                    <ScoreCell score={note.flavor} />
                    <ScoreCell score={note.aftertaste} />
                    <ScoreCell score={note.acidity} />
                    <ScoreCell score={note.body} />
                    <ScoreCell score={note.balance} />
                    <ScoreCell score={note.overall} />
                    <td className="py-4 px-4">
                      <Link
                        href={`/cupping-note/${note.id}`}
                        className="text-brown-600 hover:text-brown-800 font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentSort: SortField;
  direction: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  label,
  currentSort,
  direction,
  onSort,
}) => (
  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
    <button
      className="flex items-center focus:outline-none focus:underline"
      onClick={() => onSort(field)}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <span className="ml-1">
        {field === currentSort ? (
          direction === 'asc' ? (
            <FaSortUp aria-hidden="true" />
          ) : (
            <FaSortDown aria-hidden="true" />
          )
        ) : (
          <FaSort aria-hidden="true" />
        )}
      </span>
    </button>
  </th>
);

const ScoreCell: React.FC<{ score: number }> = ({ score }) => (
  <td className="py-4 px-4">
    <span className="inline-block bg-brown-100 text-brown-800 text-sm font-medium px-2 py-1 rounded">
      {score.toFixed(1)}
    </span>
  </td>
);

export default CuppingNotesPage;
