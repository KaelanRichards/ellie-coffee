import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';
import RoastCurveChart from './RoastCurveChart';

const RoastComparisonTool: React.FC = () => {
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([
    '',
    '',
  ]);
  const { data: roastProfiles } = trpc.roastProfile.getAll.useQuery();

  const handleProfileSelection = (index: number, profileId: string) => {
    const newSelectedProfileIds = [...selectedProfileIds];
    newSelectedProfileIds[index] = profileId;
    setSelectedProfileIds(newSelectedProfileIds);
  };

  const selectedProfiles = selectedProfileIds.map((id) =>
    roastProfiles?.find((profile) => profile.id === id),
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Roast Profile Comparison Tool</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[0, 1].map((index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Roast Profile {index + 1}
            </label>
            <select
              value={selectedProfileIds[index]}
              onChange={(e) => handleProfileSelection(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a roast profile</option>
              {roastProfiles?.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {selectedProfiles.map((profile, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            {profile ? (
              <>
                <h3 className="text-lg font-semibold mb-2">{profile.name}</h3>
                {profile.temperatureReadings ? (
                  <RoastCurveChart
                    data={{
                      temperatureReadings: profile.temperatureReadings,
                      firstCrack: profile.firstCrack ?? undefined,
                      developmentTime: profile.developmentTime ?? undefined,
                    }}
                  />
                ) : (
                  <p>No temperature readings available for this profile.</p>
                )}
                <div className="mt-4">
                  <p>First Crack: {profile.firstCrack ?? 'N/A'} seconds</p>
                  <p>
                    Development Time: {profile.developmentTime ?? 'N/A'} seconds
                  </p>
                  <p>
                    Total Roast Time: {profile.totalRoastTime ?? 'N/A'} seconds
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No profile selected</p>
            )}
          </div>
        ))}
      </div>
      {selectedProfiles[0] && selectedProfiles[1] && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Comparison</h3>
          <RoastCurveChart
            data={{
              temperatureReadings: selectedProfiles[0].temperatureReadings,
              firstCrack: selectedProfiles[0].firstCrack ?? undefined,
              developmentTime: selectedProfiles[0].developmentTime ?? undefined,
            }}
            comparisonData={{
              temperatureReadings: selectedProfiles[1].temperatureReadings,
              firstCrack: selectedProfiles[1].firstCrack ?? undefined,
              developmentTime: selectedProfiles[1].developmentTime ?? undefined,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RoastComparisonTool;
