// hooks/useAdminRefresh.ts
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function useAdminRefresh(callback: () => void | Promise<void>) {
  const lastRefreshed = useSelector((state: RootState) => state.admin.lastRefreshed);

  const handleRefresh = useCallback(() => {
    callback();
  }, [callback]);

  useEffect(() => {
    window.addEventListener('admin-refresh', handleRefresh);
    return () => window.removeEventListener('admin-refresh', handleRefresh);
  }, [handleRefresh]);

  // Also refresh when lastRefreshed changes (manual refresh button)
  useEffect(() => {
    if (lastRefreshed) {
      callback();
    }
  }, [lastRefreshed, callback]);
}