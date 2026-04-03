// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const apiKeySet = useSelector((state: RootState) => state.admin.apiKeySet);

  // Skip auth check on setup page
  const isSetupPage = pathname === '/admin/setup';

  useEffect(() => {
    if (!isSetupPage && !apiKeySet) {
      router.push('/admin/setup');
    }
  }, [isSetupPage, apiKeySet, router]);

  // Don't render on server side to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted && !isSetupPage) {
    return null; // Prevent hydration mismatch
  }

  if (!apiKeySet && !isSetupPage) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}