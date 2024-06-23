import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const CuppingNotesPage = () => {
  const { data: cuppingNotes, isLoading } = trpc.cuppingNote.getAll.useQuery();

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cupping Notes</h1>
        <Link
          href="/cupping-note/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Cupping Note
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cuppingNotes?.map((note) => (
          <div
            key={note.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-xl font-semibold">
                Roast: {note.roastLog.date.toLocaleDateString()}
              </h2>
              <p className="text-sm text-gray-600">
                Bean: {note.roastLog.beanType}
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <ScoreItem label="Aroma" score={note.aroma} />
                <ScoreItem label="Flavor" score={note.flavor} />
                <ScoreItem label="Aftertaste" score={note.aftertaste} />
                <ScoreItem label="Acidity" score={note.acidity} />
                <ScoreItem label="Body" score={note.body} />
                <ScoreItem label="Balance" score={note.balance} />
              </div>
              <ScoreItem
                label="Overall"
                score={note.overall}
                className="mt-2"
              />
              {note.notes && (
                <p className="mt-2 text-sm text-gray-600">
                  Notes: {note.notes}
                </p>
              )}
              <Link
                href={`/cupping-note/${note.id}`}
                className="mt-4 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ScoreItemProps {
  label: string;
  score: number;
  className?: string;
}

const ScoreItem: React.FC<ScoreItemProps> = ({
  label,
  score,
  className = '',
}) => (
  <div className={`flex justify-between items-center ${className}`}>
    <span className="text-sm font-medium">{label}:</span>
    <span className="text-sm font-bold">{score.toFixed(1)}</span>
  </div>
);

export default CuppingNotesPage;
