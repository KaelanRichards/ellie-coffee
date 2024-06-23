import Link from 'next/link';
import { ReactNode } from 'react';
import { CgCoffee, CgNotes, CgDatabase, CgProfile } from 'react-icons/cg';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-brown-800 text-white shadow-md">
        <nav
          className="container mx-auto px-4 py-3"
          aria-label="Main Navigation"
        >
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold flex items-center transition-colors hover:text-brown-200"
              aria-label="Coffee Roast Logger Home"
            >
              <CgCoffee className="mr-2 text-3xl" aria-hidden="true" />
              <span>Coffee Roast Logger</span>
            </Link>
            <ul className="flex space-x-6">
              {[
                { href: '/roast-log', label: 'Roast Logs', icon: CgNotes },
                { href: '/green-bean', label: 'Green Beans', icon: CgDatabase },
                {
                  href: '/roast-profile',
                  label: 'Roast Profiles',
                  icon: CgProfile,
                },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center py-2 px-3 rounded-md transition-colors hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-300"
                    aria-label={label}
                  >
                    <Icon className="mr-2 text-xl" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
