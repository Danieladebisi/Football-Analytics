import { useState, useEffect, useCallback } from 'react';
import { footballApi } from '../services/footballApi';

// Custom hook for API data fetching with loading and error states
export const useFootballData = <T>(
  apiFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedApiFunction = useCallback(apiFunction, [apiFunction, ...dependencies]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await memoizedApiFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [memoizedApiFunction]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    apiFunction()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'An error occurred'))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch };
};

// Hook for live matches using Football-Data.org API
export const useLiveMatches = () => {
  return useFootballData(() => footballApi.getTodaysMatches());
};

// Hook for Premier League standings using Football-Data.org API
export const usePremierLeagueStandings = () => {
  return useFootballData(() => footballApi.getPremierLeagueStandings());
};

// Hook for upcoming matches using Football-Data.org API
export const useUpcomingMatches = (days: number = 7) => {
  return useFootballData(() => footballApi.getUpcomingMatches(days), [days]);
};

// Hook for team details (Football-Data.org API)
export const useTeamDetails = (teamId: string | null) => {
  return useFootballData(
    () => teamId ? footballApi.getTeamDetails(teamId) : Promise.resolve(null),
    [teamId]
  );
};

// Enhanced hook for connection status and API information
export const useApiStatus = () => {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    apiType: 'free' | 'premium' | 'unknown';
    lastChecked: Date | null;
    error: string | null;
  }>({
    isConnected: false,
    apiType: 'unknown',
    lastChecked: null,
    error: null
  });

  const checkConnection = useCallback(async () => {
    try {
      const result = await footballApi.testApiConnection();
      
      // Determine API type based on environment variables
      const hasAPIKey = !!process.env.REACT_APP_FOOTBALL_API_KEY;
      
      setStatus({
        isConnected: result.success,
        apiType: hasAPIKey ? 'premium' : 'free',
        lastChecked: new Date(),
        error: result.success ? null : result.error || 'Connection failed'
      });
    } catch (err) {
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        lastChecked: new Date(),
        error: err instanceof Error ? err.message : 'Connection check failed'
      }));
    }
  }, []);

  useEffect(() => {
    checkConnection();
    
    // Check connection every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  return { ...status, checkConnection };
};