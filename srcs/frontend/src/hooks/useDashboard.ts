import { useEffect, useState, useCallback } from 'react';

import { dashboardMetrics, authService } from '../api/services';

import type { DashboardMetrics, DashboardFilters, User } from '../../../../shared/srcs/types';

export function useDashboard(filters: DashboardFilters) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [metricsRes, profileRes] = await Promise.all([
          dashboardMetrics.getGlobalMetrics(filters),
          authService.getProfile(),
        ]);

        setMetrics(metricsRes.data);
        setCurrentUser(profileRes.data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard metrics';
        console.error(errorMessage, error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [JSON.stringify(filters)]);

  const reloadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardMetrics.getGlobalMetrics(filters);
      setMetrics(res.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reload dashboard';
      console.error(errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return {
    metrics,
    currentUser,
    isLoading,
    error,
    reloadDashboard,
  };
}