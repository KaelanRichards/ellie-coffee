import React, { useState } from 'react';
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
} from 'chart.js';

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
    temperatureCurve: { time: number; temp: number }[];
    firstCrack?: number;
    developmentTime?: number;
  };
  comparisonData?: {
    temperatureCurve: { time: number; temp: number }[];
    firstCrack?: number;
    developmentTime?: number;
  };
}

const RoastCurveChart: React.FC<RoastCurveChartProps> = ({
  data,
  comparisonData,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    time: number;
    temp: number;
  } | null>(null);

  if (!data.temperatureCurve || data.temperatureCurve.length === 0) {
    return <div>No temperature data available</div>;
  }

  const chartData = {
    labels: data.temperatureCurve.map((point) => point.time),
    datasets: [
      {
        label: 'Temperature',
        data: data.temperatureCurve.map((point) => point.temp),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      ...(comparisonData
        ? [
            {
              label: 'Comparison Temperature',
              data: comparisonData.temperatureCurve.map((point) => point.temp),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Roast Curve',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
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
    onHover: (event: any, elements: any[]) => {
      if (elements && elements.length > 0) {
        const dataIndex = elements[0].index;
        const point = data.temperatureCurve[dataIndex];
        if (point) {
          setHoveredPoint(point);
        } else {
          setHoveredPoint(null);
        }
      } else {
        setHoveredPoint(null);
      }
    },
  };

  return (
    <div>
      <Line options={options} data={chartData} />
      {hoveredPoint && (
        <div className="mt-2 text-sm">
          <p>Time: {hoveredPoint.time} seconds</p>
          <p>Temperature: {hoveredPoint.temp}°F</p>
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
