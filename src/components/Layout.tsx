import Link from 'next/link';
import { ReactNode } from 'react';
import { CgCoffee, CgNotes, CgDatabase, CgProfile } from 'react-icons/cg';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-brown-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <CgCoffee className="mr-2" />
            Coffee Roast Logger
          </Link>
          <div className="space-x-4">
            <Link
              href="/roast-log"
              className="hover:text-brown-200 flex items-center"
            >
              <CgNotes className="mr-1" /> Roast Logs
            </Link>
            <Link
              href="/green-bean"
              className="hover:text-brown-200 flex items-center"
            >
              <CgDatabase className="mr-1" /> Green Beans
            </Link>
            <Link
              href="/roast-profile"
              className="hover:text-brown-200 flex items-center"
            >
              <CgProfile className="mr-1" /> Roast Profiles
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
