import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';
import RoastCurveChart from './RoastCurveChart';

const RoastComparisonTool: React.FC = () => {
  const [selectedRoastIds, setSelectedRoastIds] = useState<string[]>(['', '']);
  const { data: roastLogs } = trpc.roastLog.getAll.useQuery();

  const handleRoastSelection = (index: number, roastId: string) => {
    const newSelectedRoastIds = [...selectedRoastIds];
    newSelectedRoastIds[index] = roastId;
    setSelectedRoastIds(newSelectedRoastIds);
  };

  const selectedRoasts = selectedRoastIds.map((id) =>
    roastLogs?.find((log) => log.id === id),
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Roast Comparison Tool</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[0, 1].map((index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Roast {index + 1}
            </label>
            <select
              value={selectedRoastIds[index]}
              onChange={(e) => handleRoastSelection(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a roast</option>
              {roastLogs?.map((log) => (
                <option key={log.id} value={log.id}>
                  {log.date.toLocaleDateString()} - {log.beanType}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {selectedRoasts.map((roast, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            {roast ? (
              <>
                <h3 className="text-lg font-semibold mb-2">
                  {roast.date.toLocaleDateString()} - {roast.beanType}
                </h3>
                {roast?.profile?.temperatureCurve ? (
                  <RoastCurveChart
                    data={{
                      temperatureCurve: roast.profile.temperatureCurve,
                      firstCrack: roast.profile.firstCrack,
                      developmentTime: roast.profile.developmentTime,
                    }}
                  />
                ) : (
                  <p>No profile data available for this roast.</p>
                )}
                <div className="mt-4">
                  <p>Equipment: {roast.equipment}</p>
                  <p>Weight: {roast.weight}g</p>
                  <p>Notes: {roast.notes}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No roast selected</p>
            )}
          </div>
        ))}
      </div>
      {selectedRoasts[0] && selectedRoasts[1] && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Comparison</h3>
          <RoastCurveChart
            data={{
              temperatureCurve: selectedRoasts[0].profile.data.temperatureCurve,
              firstCrack: selectedRoasts[0].profile.data.firstCrack,
              developmentTime: selectedRoasts[0].profile.data.developmentTime,
            }}
            comparisonData={{
              temperatureCurve: selectedRoasts[1].profile.data.temperatureCurve,
              firstCrack: selectedRoasts[1].profile.data.firstCrack,
              developmentTime: selectedRoasts[1].profile.data.developmentTime,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RoastComparisonTool;
