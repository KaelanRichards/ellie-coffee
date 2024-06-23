import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import RoastCurveChart from '~/components/RoastCurveChart';

const RoastProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: profile, isLoading } = trpc.roastProfile.getById.useQuery({
    id: id as string,
  });
  const updateProfile = trpc.roastProfile.update.useMutation();
  const deleteProfile = trpc.roastProfile.delete.useMutation({
    onSuccess: () => {
      router.push('/roast-profile');
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return <div role="alert">Profile not found</div>;

  const formatChartData = (profile: any) => {
    return {
      temperatureReadings: profile.temperatureReadings.map((reading: any) => ({
        time: reading.time,
        temperature: reading.temperature,
      })),
      firstCrack: profile.firstCrack,
      developmentTime: profile.developmentTime,
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateProfile.mutateAsync({
      id: profile.id,
      temperatureReadings: profile.temperatureReadings, // Add this line
      name: formData.get('name') as string,
      firstCrack: parseInt(formData.get('firstCrack') as string) || undefined,
      developmentTime:
        parseInt(formData.get('developmentTime') as string) || undefined,
      endTemperature:
        parseInt(formData.get('endTemperature') as string) || undefined,
      totalRoastTime:
        parseInt(formData.get('totalRoastTime') as string) || undefined,
      chargeTemperature:
        parseInt(formData.get('chargeTemperature') as string) || undefined,
      dryingPhaseEnd:
        parseInt(formData.get('dryingPhaseEnd') as string) || undefined,
      firstCrackEnd:
        parseInt(formData.get('firstCrackEnd') as string) || undefined,
      coolingStarted:
        parseInt(formData.get('coolingStarted') as string) || undefined,
      airflowSettings: JSON.parse(formData.get('airflowSettings') as string),
      drumSpeed: parseInt(formData.get('drumSpeed') as string) || undefined,
      heatSettings: JSON.parse(formData.get('heatSettings') as string),
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this roast profile?')) {
      await deleteProfile.mutateAsync({ id: profile.id });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <nav className="mb-8">
        <Link
          href="/roast-profile"
          className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" aria-hidden="true" />
          <span>Back to Profiles</span>
        </Link>
      </nav>
      <main>
        <h1 className="text-3xl font-bold mb-6 text-brown-900">
          Roast Profile Details
        </h1>
        <section
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          aria-labelledby="profile-details"
        >
          <h2 id="profile-details" className="sr-only">
            Profile Information
          </h2>
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <FormField
                    label="Name"
                    name="name"
                    type="text"
                    defaultValue={profile.name}
                  />
                  <FormField
                    label="First Crack (seconds)"
                    name="firstCrack"
                    type="number"
                    defaultValue={profile.firstCrack?.toString()}
                  />
                  <FormField
                    label="Development Time (seconds)"
                    name="developmentTime"
                    type="number"
                    defaultValue={profile.developmentTime?.toString()}
                  />
                  <FormField
                    label="End Temperature (°F)"
                    name="endTemperature"
                    type="number"
                    defaultValue={profile.endTemperature?.toString()}
                  />
                  <FormField
                    label="Total Roast Time (seconds)"
                    name="totalRoastTime"
                    type="number"
                    defaultValue={profile.totalRoastTime?.toString()}
                  />
                  <FormField
                    label="Charge Temperature (°F)"
                    name="chargeTemperature"
                    type="number"
                    defaultValue={profile.chargeTemperature?.toString()}
                  />
                  <FormField
                    label="Drying Phase End (seconds)"
                    name="dryingPhaseEnd"
                    type="number"
                    defaultValue={profile.dryingPhaseEnd?.toString()}
                  />
                  <FormField
                    label="First Crack End (seconds)"
                    name="firstCrackEnd"
                    type="number"
                    defaultValue={profile.firstCrackEnd?.toString()}
                  />
                  <FormField
                    label="Cooling Started (seconds)"
                    name="coolingStarted"
                    type="number"
                    defaultValue={profile.coolingStarted?.toString()}
                  />
                  <FormField
                    label="Drum Speed (RPM)"
                    name="drumSpeed"
                    type="number"
                    defaultValue={profile.drumSpeed?.toString()}
                  />
                  <div>
                    <label
                      htmlFor="airflowSettings"
                      className="block text-sm font-medium text-brown-700 mb-1"
                    >
                      Airflow Settings (JSON)
                    </label>
                    <textarea
                      id="airflowSettings"
                      name="airflowSettings"
                      defaultValue={JSON.stringify(
                        profile.airflowSettings,
                        null,
                        2,
                      )}
                      className="w-full p-2 border border-brown-300 rounded-md focus:ring-brown-500 focus:border-brown-500 font-mono"
                      rows={5}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="heatSettings"
                      className="block text-sm font-medium text-brown-700 mb-1"
                    >
                      Heat Settings (JSON)
                    </label>
                    <textarea
                      id="heatSettings"
                      name="heatSettings"
                      defaultValue={JSON.stringify(
                        profile.heatSettings,
                        null,
                        2,
                      )}
                      className="w-full p-2 border border-brown-300 rounded-md focus:ring-brown-500 focus:border-brown-500 font-mono"
                      rows={5}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                  >
                    <FaSave className="mr-2" aria-hidden="true" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <ProfileDetail label="Name" value={profile.name} />
                <ProfileDetail
                  label="First Crack"
                  value={`${profile.firstCrack ?? 'N/A'} seconds`}
                />
                <ProfileDetail
                  label="Development Time"
                  value={`${profile.developmentTime ?? 'N/A'} seconds`}
                />
                <ProfileDetail
                  label="End Temperature"
                  value={`${profile.endTemperature ?? 'N/A'} °F`}
                />
                <ProfileDetail
                  label="Total Roast Time"
                  value={`${profile.totalRoastTime ?? 'N/A'} seconds`}
                />
                <ProfileDetail
                  label="Charge Temperature"
                  value={`${profile.chargeTemperature ?? 'N/A'} °F`}
                />
                <ProfileDetail
                  label="Drying Phase End"
                  value={`${profile.dryingPhaseEnd ?? 'N/A'} seconds`}
                />
                <ProfileDetail
                  label="First Crack End"
                  value={`${profile.firstCrackEnd ?? 'N/A'} seconds`}
                />
                <ProfileDetail
                  label="Cooling Started"
                  value={`${profile.coolingStarted ?? 'N/A'} seconds`}
                />
                <ProfileDetail
                  label="Drum Speed"
                  value={`${profile.drumSpeed ?? 'N/A'} RPM`}
                />
                <div>
                  <h3 className="text-lg font-medium text-brown-900">
                    Airflow Settings
                  </h3>
                  <pre className="mt-1 text-sm text-brown-500 bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(profile.airflowSettings, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-brown-900">
                    Heat Settings
                  </h3>
                  <pre className="mt-1 text-sm text-brown-500 bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(profile.heatSettings, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brown-700 bg-brown-100 hover:bg-brown-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
            >
              {isEditing ? (
                'Cancel'
              ) : (
                <>
                  <FaEdit className="mr-2" aria-hidden="true" />
                  Edit
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              aria-label="Delete roast profile"
            >
              <FaTrash className="mr-2" aria-hidden="true" />
              Delete
            </button>
          </div>
        </section>
        <section className="mt-8" aria-labelledby="roast-curve">
          <h2
            id="roast-curve"
            className="text-2xl font-bold mb-4 text-brown-900"
          >
            Roast Curve
          </h2>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <RoastCurveChart data={formatChartData(profile)} />
          </div>
        </section>
      </main>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  defaultValue?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  defaultValue,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-brown-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      defaultValue={defaultValue}
      className="w-full p-2 border border-brown-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
    />
  </div>
);

interface ProfileDetailProps {
  label: string;
  value: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ label, value }) => (
  <div>
    <h3 className="text-lg font-medium text-brown-900">{label}</h3>
    <p className="mt-1 text-sm text-brown-500">{value}</p>
  </div>
);

export default RoastProfilePage;
