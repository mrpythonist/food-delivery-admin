import useSWR from 'swr';

import api from './axios';

const fetcher = (url) => api.get(url).then((res) => res.data);

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR('/reports/dashboard', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false
  });

  return {
    dashboard: data,
    dashboardLoading: isLoading,
    dashboardError: error,
    dashboardMutate: mutate
  };
}
