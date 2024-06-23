import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { TemperatureReading } from '@prisma/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export interface RoastCurveChartProps {
  data: {
    temperatureReadings: { time: number; temperature: number }[];
    firstCrack?: number;
    developmentTime?: number;
  };
  comparisonData?: {
    temperatureReadings: { time: number; temperature: number }[];
    firstCrack?: number;
    developmentTime?: number;
  };
}

const RoastCurveChart: React.FC<RoastCurveChartProps> = ({
  data,
  comparisonData,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<Pick<
    TemperatureReading,
    'time' | 'temperature'
  > | null>(null);

  const chartData = useMemo(
    () => ({
      labels: data.temperatureReadings.map((reading) => reading.time),
      datasets: [
        {
          label: 'Temperature',
          data: data.temperatureReadings.map((reading) => reading.temperature),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        ...(comparisonData
          ? [
              {
                label: 'Comparison Temperature',
                data: comparisonData.temperatureReadings.map(
                  (reading) => reading.temperature,
                ),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
              },
            ]
          : []),
      ],
    }),
    [data.temperatureReadings, comparisonData],
  );

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: comparisonData ? 'Roast Curve Comparison' : 'Roast Curve',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label ?? '';
            const value = context.parsed.y;
            return `${label}: ${value}°F`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (seconds)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°F)',
        },
      },
    },
    onHover: (event, elements) => {
      if (elements && elements.length > 0) {
        const dataIndex = elements[0]?.index;
        const point =
          dataIndex !== undefined
            ? data.temperatureReadings[dataIndex] ?? null
            : null;
        setHoveredPoint(
          point ? { time: point.time, temperature: point.temperature } : null,
        );
      } else {
        setHoveredPoint(null);
      }
    },
  };

  if (!data.temperatureReadings || data.temperatureReadings.length === 0) {
    return <div>No temperature data available</div>;
  }

  return (
    <div>
      <Line options={options} data={chartData} />
      {hoveredPoint && (
        <div className="mt-2 text-sm">
          <p>Time: {hoveredPoint.time} seconds</p>
          <p>Temperature: {hoveredPoint.temperature}°F</p>
          {data.firstCrack && hoveredPoint.time >= data.firstCrack && (
            <p>First Crack: {data.firstCrack} seconds</p>
          )}
          {data.developmentTime &&
            hoveredPoint.time >= data.developmentTime && (
              <p>Development Time: {data.developmentTime} seconds</p>
            )}
        </div>
      )}
    </div>
  );
};

export default RoastCurveChart;
