import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { CgCoffee, CgDatabase } from 'react-icons/cg';
import { FaCalendarAlt, FaLeaf, FaMugHot, FaCoffee } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="bg-gradient-to-br from-brown-50 to-brown-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-brown-900 mb-2 flex items-center">
            <CgCoffee className="mr-4 text-brown-600" aria-hidden="true" />
            Roast Master Dashboard
          </h1>
          <p className="text-xl text-brown-600">
            Your daily roasting command center
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            icon={<CgCoffee className="text-brown-600" size={24} />}
            title="Total Roasts"
            value={totalRoasts?.toString() ?? '0'}
            color="bg-amber-100"
          />
          <DashboardCard
            icon={<FaLeaf className="text-green-600" size={24} />}
            title="Bean Varieties"
            value={totalBeans?.toString() ?? '0'}
            color="bg-green-100"
          />
          <DashboardCard
            icon={<FaCalendarAlt className="text-blue-600" size={24} />}
            title="Upcoming Roasts"
            value={upcomingRoasts?.length.toString() ?? '0'}
            color="bg-blue-100"
          />
          <DashboardCard
            icon={<CgDatabase className="text-red-600" size={24} />}
            title="Low Stock"
            value={lowStockBeans?.length?.toString() ?? '0'}
            color="bg-red-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <RecentRoastsSection
            recentRoasts={recentRoasts?.map((roast) => ({
              id: roast.id,
              date: roast.date,
              beanType: roast.beanType,
              profile: { name: roast.profile.name },
              weight: roast.weight ?? 0,
            }))}
          />
          <UpcomingRoastsSection upcomingRoasts={upcomingRoasts} />
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
        </div>

        <QuickActionButtons />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  value,
  color,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`${color} rounded-lg shadow-lg p-6 flex items-center transition-all duration-300`}
  >
    <div className="mr-4">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
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
  <section className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold mb-4 text-brown-800 flex items-center">
      <FaCoffee className="mr-2 text-brown-600" aria-hidden="true" /> Recent
      Roasts
    </h2>
    <ul className="space-y-4">
      {recentRoasts?.slice(0, 5).map((roast) => (
        <li key={roast.id}>
          <Link
            href={`/roast-log/${roast.id}`}
            className="block bg-brown-50 p-4 rounded-lg hover:bg-brown-100 transition-colors"
          >
            <div className="font-medium text-brown-800">
              {roast.date.toLocaleDateString()} - {roast.beanType}
            </div>
            <div className="text-sm text-brown-600">
              {roast.profile.name} | {roast.weight}g
            </div>
          </Link>
        </li>
      ))}
    </ul>
    <Link
      href="/roast-log"
      className="mt-4 inline-block text-brown-600 hover:text-brown-800 font-medium"
    >
      View all roasts →
    </Link>
  </section>
);

const UpcomingRoastsSection: React.FC<{
  upcomingRoasts: any[] | undefined;
}> = ({ upcomingRoasts }) => (
  <section className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold mb-4 text-brown-800 flex items-center">
      <FaCalendarAlt className="mr-2 text-brown-600" aria-hidden="true" />{' '}
      Upcoming Roasts
    </h2>
    <ul className="space-y-4">
      {upcomingRoasts?.slice(0, 5).map((roast) => (
        <li key={roast.id}>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-medium text-blue-800">
              {roast.date.toLocaleDateString()} - {roast.beanType}
            </div>
            <div className="text-sm text-blue-600">
              {roast.profile.name} | Planned: {roast.plannedWeight}g
            </div>
          </div>
        </li>
      ))}
    </ul>
    <Link
      href="/batch-planning"
      className="mt-4 inline-block text-brown-600 hover:text-brown-800 font-medium"
    >
      Manage batch planning →
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
  <section className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold mb-4 text-brown-800 flex items-center">
      <CgDatabase className="mr-2 text-brown-600" aria-hidden="true" /> Low
      Stock Alerts
    </h2>
    <ul className="space-y-4">
      {lowStockBeans?.slice(0, showAllLowStock ? undefined : 3).map((bean) => (
        <li key={bean.id} className="bg-red-50 p-4 rounded-lg">
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
        className="mt-4 text-brown-600 hover:text-brown-800 font-medium"
      >
        {showAllLowStock
          ? 'Show less'
          : `Show ${lowStockBeans.length - 3} more`}
      </button>
    )}
    <Link
      href="/green-bean"
      className="mt-4 block text-brown-600 hover:text-brown-800 font-medium"
    >
      Manage green beans →
    </Link>
  </section>
);

const QuickActionButtons = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
    <QuickActionButton
      href="/roast-log/new"
      icon={<FaCoffee size={24} />}
      label="New Roast Log"
      color="bg-brown-600 hover:bg-brown-700"
    />
    <QuickActionButton
      href="/green-bean/new"
      icon={<FaLeaf size={24} />}
      label="Add Green Beans"
      color="bg-green-600 hover:bg-green-700"
    />
    <QuickActionButton
      href="/cupping-note/new"
      icon={<FaMugHot size={24} />}
      label="New Cupping Note"
      color="bg-purple-600 hover:bg-purple-700"
    />
    <QuickActionButton
      href="/batch-planning"
      icon={<FaCalendarAlt size={24} />}
      label="Batch Planning"
      color="bg-blue-600 hover:bg-blue-700"
    />
  </div>
);

interface QuickActionButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  href,
  icon,
  label,
  color,
}) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${color} text-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-center h-full transition-colors duration-300`}
    >
      {icon}
      <span className="mt-2 font-medium">{label}</span>
    </motion.div>
  </Link>
);

export default DashboardPage;
