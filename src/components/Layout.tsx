import Link from 'next/link';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import {
  FaCoffee,
  FaLeaf,
  FaChartLine,
  FaClipboardList,
  FaCog,
} from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-brown-900 text-white">
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <FaCoffee className="text-2xl" />
            <span>Roast Master</span>
          </Link>
        </div>
        <nav className="mt-8">
          <NavItem href="/" icon={FaChartLine} label="Dashboard" />
          <NavItem
            href="/roast-log"
            icon={FaClipboardList}
            label="Roast Logs"
          />
          <NavItem href="/green-bean" icon={FaLeaf} label="Green Beans" />
          <NavItem
            href="/roast-profile"
            icon={FaCoffee}
            label="Roast Profiles"
          />
          <NavItem href="/settings" icon={FaCog} label="Settings" />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Coffee Roast Logger
            </h1>
          </div>
        </header>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ href: string; icon: IconType; label: string }> = ({
  href,
  icon: Icon,
  label,
}) => (
  <Link
    href={href}
    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-brown-800 hover:text-white transition-colors"
  >
    <Icon className="text-xl" />
    <span>{label}</span>
  </Link>
);

export default Layout;
