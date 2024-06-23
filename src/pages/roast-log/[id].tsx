import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaSave, FaArrowLeft, FaCoffee } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const RoastLogPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: roastLog,
    isLoading,
    error,
  } = trpc.roastLog.getById.useQuery({
    id: id as string,
  });
  const updateRoastLog = trpc.roastLog.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);
  const { data: cuppingNotes } = trpc.cuppingNote.getByRoastLogId.useQuery({
    roastLogId: id as string,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div role="alert" className="text-red-600 text-center text-xl p-4">
        Error: {error.message}
      </div>
    );
  if (!roastLog)
    return (
      <div role="alert" className="text-gray-600 text-center text-xl p-4">
        Roast log not found
      </div>
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateRoastLog.mutateAsync({
      id: roastLog.id,
      date: new Date(formData.get('date') as string),
      beanType: formData.get('beanType') as string,
      profileId: formData.get('profileId') as string,
      equipment: formData.get('equipment') as string,
      notes: formData.get('notes') as string,
      weight: parseFloat(formData.get('weight') as string),
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/roast-log"
            className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" aria-hidden="true" />
            <span>Back to Roast Logs</span>
          </Link>
        </nav>

        <main>
          <h1 className="text-4xl font-bold mb-6 text-brown-900 flex items-center">
            <FaCoffee className="mr-3 text-brown-600" aria-hidden="true" />
            Roast Log Details
          </h1>

          <article className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <RoastLogFormField
                      label="Date"
                      name="date"
                      type="date"
                      defaultValue={
                        roastLog.date?.toISOString().split('T')[0] ?? ''
                      }
                    />
                    <RoastLogFormField
                      label="Bean Type"
                      name="beanType"
                      type="text"
                      defaultValue={roastLog.beanType}
                    />
                    <RoastLogFormField
                      label="Profile"
                      name="profileId"
                      type="text"
                      defaultValue={roastLog.profileId}
                    />
                    <RoastLogFormField
                      label="Equipment"
                      name="equipment"
                      type="text"
                      defaultValue={roastLog.equipment}
                    />
                    <RoastLogFormField
                      label="Weight (g)"
                      name="weight"
                      type="number"
                      defaultValue={roastLog.weight?.toString() ?? ''}
                    />
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        defaultValue={roastLog.notes ?? ''}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-colors"
                    >
                      <FaSave className="mr-2" aria-hidden="true" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <RoastLogDetail
                    label="Date"
                    value={roastLog.date.toLocaleDateString()}
                  />
                  <RoastLogDetail label="Bean Type" value={roastLog.beanType} />
                  <RoastLogDetail
                    label="Profile"
                    value={roastLog.profile.name}
                  />
                  <RoastLogDetail
                    label="Equipment"
                    value={roastLog.equipment}
                  />
                  <RoastLogDetail
                    label="Weight"
                    value={roastLog.weight ? `${roastLog.weight}g` : 'N/A'}
                  />
                  <RoastLogDetail
                    label="Notes"
                    value={roastLog.notes ?? 'No notes'}
                  />
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-colors"
                aria-label={isEditing ? 'Cancel editing' : 'Edit roast log'}
              >
                {isEditing ? (
                  'Cancel'
                ) : (
                  <>
                    <FaEdit className="mr-2" aria-hidden="true" /> Edit
                  </>
                )}
              </button>
            </div>
          </article>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-brown-900">
              Cupping Notes
            </h2>
            {cuppingNotes && cuppingNotes.length > 0 ? (
              <ul className="space-y-4">
                {cuppingNotes.map((note) => (
                  <li key={note.id} className="bg-white shadow rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <CuppingNoteDetail label="Aroma" value={note.aroma} />
                      <CuppingNoteDetail label="Flavor" value={note.flavor} />
                      <CuppingNoteDetail
                        label="Aftertaste"
                        value={note.aftertaste}
                      />
                      <CuppingNoteDetail label="Acidity" value={note.acidity} />
                      <CuppingNoteDetail label="Body" value={note.body} />
                      <CuppingNoteDetail label="Balance" value={note.balance} />
                      <CuppingNoteDetail label="Overall" value={note.overall} />
                    </div>
                    {note.notes && (
                      <div className="mt-2">
                        <strong className="text-gray-700">Notes:</strong>{' '}
                        <span className="text-gray-600">{note.notes}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                No cupping notes available for this roast.
              </p>
            )}
            <Link
              href={`/cupping-note/new?roastLogId=${id?.toString()}`}
              className="mt-4 inline-block bg-brown-600 text-white px-4 py-2 rounded hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 transition-colors"
            >
              Add Cupping Note
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

interface RoastLogFormFieldProps {
  label: string;
  name: string;
  type: string;
  defaultValue: string;
}

const RoastLogFormField: React.FC<RoastLogFormFieldProps> = ({
  label,
  name,
  type,
  defaultValue,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      defaultValue={defaultValue}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500 transition-colors text-gray-900"
    />
  </div>
);

interface RoastLogDetailProps {
  label: string;
  value: string;
}

const RoastLogDetail: React.FC<RoastLogDetailProps> = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

interface CuppingNoteDetailProps {
  label: string;
  value: number;
}

const CuppingNoteDetail: React.FC<CuppingNoteDetailProps> = ({
  label,
  value,
}) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value.toFixed(1)}</dd>
  </div>
);

export default RoastLogPage;
