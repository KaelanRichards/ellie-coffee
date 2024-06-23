import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { CgCoffee, CgDatabase } from 'react-icons/cg';
import {
  FaCalendarAlt,
  FaLeaf,
  FaTools,
  FaFlask,
  FaMugHot,
  FaCoffee,
} from 'react-icons/fa';
import { useState } from 'react';

const DashboardPage = () => {
  const { data: recentRoasts, isLoading: roastsLoading } =
    trpc.roastLog.getRecent.useQuery();
  const { data: lowStockBeans, isLoading: beansLoading } =
    trpc.greenBean.getLowStock.useQuery({ threshold: 5 });
  const { data: upcomingRoasts, isLoading: upcomingLoading } =
    trpc.roastLog.getUpcoming.useQuery();
  const { data: totalRoasts, isLoading: totalRoastsLoading } =
    trpc.roastLog.getTotalCount.useQuery();
  const { data: totalBeans, isLoading: totalBeansLoading } =
    trpc.greenBean.getTotalCount.useQuery();

  const [showAllLowStock, setShowAllLowStock] = useState(false);

  if (
    roastsLoading ||
    beansLoading ||
    upcomingLoading ||
    totalRoastsLoading ||
    totalBeansLoading
  ) {
    return (
      <div className="flex items-center justify-center h-screen" role="status">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brown-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-light mb-4 text-gray-900">
          Roast Master Dashboard
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <DashboardCard
            icon={<CgCoffee className="text-brown-600" size={20} />}
            title="Total Roasts"
            value={totalRoasts?.toString() ?? '0'}
          />
          <DashboardCard
            icon={<FaLeaf className="text-green-600" size={20} />}
            title="Bean Varieties"
            value={totalBeans?.toString() ?? '0'}
          />
          <DashboardCard
            icon={<FaCalendarAlt className="text-blue-600" size={20} />}
            title="Upcoming Roasts"
            value={upcomingRoasts?.length.toString() ?? '0'}
          />
          <DashboardCard
            icon={<CgDatabase className="text-red-600" size={20} />}
            title="Low Stock"
            value={lowStockBeans?.length?.toString() ?? '0'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RecentRoastsSection
            recentRoasts={recentRoasts?.map((roast) => ({
              id: roast.id,
              date: roast.date,
              beanType: roast.beanType,
              profile: { name: roast.profile.name },
              weight: roast.weight ?? 0,
            }))}
          />
          <EquipmentSection />
          <ExperimentSection />
        </div>

        <LowStockSection
          lowStockBeans={
            lowStockBeans?.map((bean) => ({
              id: bean.id,
              origin: bean.origin,
              variety: bean.variety,
              quantity: bean.quantity,
            })) ?? []
          }
          showAllLowStock={showAllLowStock}
          setShowAllLowStock={setShowAllLowStock}
        />
        <QuickActionButtons />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  value,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
    <div className="mr-4">{icon}</div>
    <div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-3xl font-bold text-gray-700">{value}</p>
    </div>
  </div>
);

interface RecentRoast {
  id: string;
  date: Date;
  beanType: string;
  profile: { name: string };
  weight: number;
}

const RecentRoastsSection: React.FC<{
  recentRoasts: RecentRoast[] | undefined;
}> = ({ recentRoasts }) => (
  <section className="bg-white rounded-lg shadow-sm p-4">
    <h2 className="text-lg font-light mb-2 text-gray-800 flex items-center">
      <CgCoffee className="mr-2 text-brown-600" aria-hidden="true" /> Recent
      Roasts
    </h2>
    <ul className="space-y-2">
      {recentRoasts?.slice(0, 3).map((roast) => (
        <li key={roast.id}>
          <Link
            href={`/roast-log/${roast.id}`}
            className="block bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <div className="font-medium text-gray-800">
              {roast.date.toLocaleDateString()} - {roast.beanType}
            </div>
            <div className="text-sm text-gray-500">
              {roast.profile.name} | {roast.weight}g
            </div>
          </Link>
        </li>
      ))}
    </ul>
    <Link
      href="/roast-log"
      className="text-sm text-brown-600 hover:text-brown-800"
    >
      View all →
    </Link>
  </section>
);

interface LowStockSectionProps {
  lowStockBeans: {
    id: string;
    origin: string;
    variety: string;
    quantity: number;
  }[];
  showAllLowStock: boolean;
  setShowAllLowStock: React.Dispatch<React.SetStateAction<boolean>>;
}
const LowStockSection: React.FC<LowStockSectionProps> = ({
  lowStockBeans,
  showAllLowStock,
  setShowAllLowStock,
}) => (
  <section className="bg-white rounded-lg shadow-sm p-4">
    <h2 className="text-lg font-light mb-2 text-gray-800 flex items-center">
      <CgDatabase className="mr-2 text-brown-600" aria-hidden="true" /> Low
      Stock Alerts
    </h2>
    <ul className="space-y-2">
      {lowStockBeans?.slice(0, showAllLowStock ? undefined : 3).map((bean) => (
        <li key={bean.id} className="bg-red-50 p-2 rounded-lg">
          <div className="font-medium text-red-800">
            {bean.origin} - {bean.variety}
          </div>
          <div className="text-sm text-red-600">
            {bean.quantity}kg remaining
          </div>
        </li>
      ))}
    </ul>
    {lowStockBeans && lowStockBeans.length > 3 && (
      <button
        onClick={() => setShowAllLowStock(!showAllLowStock)}
        className="mt-2 text-brown-600 hover:text-brown-800"
      >
        {showAllLowStock
          ? 'Show less'
          : `Show ${lowStockBeans.length - 3} more`}
      </button>
    )}
    <Link
      href="/green-bean"
      className="mt-2 text-sm text-brown-600 hover:text-brown-800"
    >
      Manage beans →
    </Link>
  </section>
);

const QuickActionButtons = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
    <DashboardButton
      href="/roast-log/new"
      icon={<FaCoffee className="text-white" size={20} />}
      label="New Roast Log"
      primary
    />
    <DashboardButton
      href="/green-bean/new"
      icon={<FaLeaf className="text-white" size={20} />}
      label="Add Green Beans"
      primary
      color="green"
    />
    <DashboardButton
      href="/cupping-note/new"
      icon={<FaMugHot className="text-white" size={20} />}
      label="New Cupping Note"
      primary
      color="purple"
    />
    <DashboardButton
      href="/batch-planning"
      icon={<FaCalendarAlt className="text-white" size={20} />}
      label="Batch Planning"
      primary
      color="blue"
    />
  </div>
);

interface DashboardButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  color?: 'brown' | 'green' | 'purple' | 'blue';
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  href,
  icon,
  label,
  primary,
  color = 'brown',
}) => (
  <Link
    href={href}
    className={`
      flex items-center px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
      ${
        primary
          ? `bg-${color}-600 text-white hover:bg-${color}-700 focus:ring-${color}-500`
          : `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400`
      }
    `}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Link>
);

const EquipmentSection: React.FC = () => {
  const { data: equipment } = trpc.equipment.getAll.useQuery();
  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-light mb-2 text-gray-800 flex items-center">
        <FaTools className="mr-2 text-gray-600" aria-hidden="true" /> Equipment
      </h2>
      <ul className="space-y-2">
        {equipment?.slice(0, 3).map((eq) => (
          <li key={eq.id}>
            <Link
              href={`/equipment/${eq.id}`}
              className="block bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <div className="font-medium text-gray-800">{eq.name}</div>
              <div className="text-sm text-gray-500">
                {eq.type} | {eq.manufacturer}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/equipment"
        className="text-sm text-brown-600 hover:text-brown-800"
      >
        View all →
      </Link>
    </section>
  );
};

const ExperimentSection: React.FC = () => {
  const { data: experiments } = trpc.experiment.getAll.useQuery();
  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-light mb-2 text-gray-800 flex items-center">
        <FaFlask className="mr-2 text-gray-600" aria-hidden="true" />{' '}
        Experiments
      </h2>
      <ul className="space-y-2">
        {experiments?.slice(0, 3).map((exp) => (
          <li key={exp.id}>
            <Link
              href={`/experiment/${exp.id}`}
              className="block bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <div className="font-medium text-gray-800">{exp.name}</div>
              <div className="text-sm text-gray-500">
                Status: {exp.status} | Started:{' '}
                {exp.startDate.toLocaleDateString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/experiment"
        className="text-sm text-brown-600 hover:text-brown-800"
      >
        View all →
      </Link>
    </section>
  );
};

export default DashboardPage;
