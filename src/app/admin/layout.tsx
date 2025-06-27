'use client';

import { ReactNode, useState } from 'react';
import { FaHome, FaUser, FaBriefcase, FaFolder, FaCog, FaTimes, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from './loading';

const ADMIN_LINKS = [
  { href: '/admin', icon: FaHome, label: 'Dashboard' },
  { href: '/admin/profile', icon: FaUser, label: 'Profile' },
  { href: '/admin/experience', icon: FaBriefcase, label: 'Experience' },
  { href: '/admin/projects', icon: FaFolder, label: 'Projects' },
  { href: '/admin/settings', icon: FaCog, label: 'Settings' },
];

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  // Show loading state
  if (status === 'loading') {
    return <Loading />;
  }

  // Redirect if not authenticated or not admin
  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    router.push('/auth/signin');
    return null;
  }

  // on mobile screen, show the sidebar icon when clicked on the icon then sidebar will be shown else hide it

  return (
    <div className="min-h-screen bg-primary-900/20">
      <Navbar />
      {/* Sidebar */}
      <div className={`fixed inset-0 bg-black/50 transition-opacity ${showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowSidebar(false)} />
      <aside className={`fixed inset-y-0 left-0 bg-primary-800 border-r border-primary-700 mt-16 transition-all z-40 ${showSidebar ? 'md:w-72 w-full' : 'w-2'}`}>
        {showSidebar ? (
          <div className='max-w-72 w-full'>
            <div className="p-4 pt-6 md:p-6 flex items-center justify-between">
              <Link
                href="/admin"
                className="text-2xl font-bold text-primary-100 hover:text-primary-50 transition"
              >
                Portfolio Admin
              </Link>
              <div className="flex items-center gap-2 justify-end">
                <button className='text-2xl text-primary-100' onClick={() => setShowSidebar(false)}>
                  <FaTimes />
                </button>
              </div>
            </div>

            <nav className="mt-2">
              {ADMIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-6 py-3 text-primary-200 hover:bg-primary-700 hover:text-primary-50 transition-colors"
                  onClick={() => setShowSidebar(false)}
                >
                  <link.icon className="text-lg" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        ) : (
          <div className='p-4 py-5 mt-3 md:p-6 w-9 bg-primary-800 rounded-tr-3xl rounded-br-3xl flex items-center justify-center'>
            <button className='flex items-center gap-2 justify-center'>
              <FaBars
                className='text-primary-100 cursor-pointer !text-2xl'
                onClick={() => setShowSidebar(true)}
              />
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={`${showSidebar ? 'ml-0' : 'ml-4'} p-5 py-6 md:p-8 mt-16 text-primary-50`}>
        {children}
      </main>
    </div>
  );
} 