import { useEffect, useState, useCallback } from 'react';

import { dashboardMetrics, authService } from '../api/services';

import { GlobalRole } from '../../../../shared/srcs/types';
import type { DashboardMetrics, DashboardFilters, User } from '../../../../shared/srcs/types';

export function useDashboard(filters: DashboardFilters) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (activeFilters: DashboardFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const profileRes = await authService.getProfile();
      const profile = profileRes.data as User & { role?: GlobalRole };
      const user: User = {
        ...profile,
        globalRole: profile.globalRole ?? profile.role ?? GlobalRole.USER,
      };

      setCurrentUser(user);

      if (user.globalRole !== GlobalRole.ADMIN) {
        setMetrics(null);
        setError('Forbidden');
        return;
      }

      const metricsRes = await dashboardMetrics.getGlobalMetrics(activeFilters);
      setMetrics(metricsRes.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard metrics';
      console.error(errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard(filters);
  }, [filters, loadDashboard]);

  const reloadDashboard = useCallback(async () => {
    await loadDashboard(filters);
  }, [filters, loadDashboard]);

  return {
    metrics,
    currentUser,
    isLoading,
    error,
    reloadDashboard,
  };
}