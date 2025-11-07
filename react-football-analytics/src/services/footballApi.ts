// Football Data API Service
// Use proxy for development to avoid CORS issues
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api/football/v4'  // Use proxy in development
  : 'https://api.football-data.org/v4'; // Direct API in production

const API_KEY = process.env.REACT_APP_FOOTBALL_API_KEY;

// API request headers
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Only add API key for direct API calls (production)
  if (process.env.NODE_ENV !== 'development' && API_KEY) {
    headers['X-Auth-Token'] = API_KEY;
  }
  
  return headers;
};

// Generic API request function with error handling
const apiRequest = async (endpoint: string) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🔗 Making API request to:', url);
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('🔑 Using headers:', getHeaders());

    const response = await fetch(url, {
      headers: getHeaders(),
    });

    console.log('📡 API Response status:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again in a minute.');
      }
      if (response.status === 403) {
        throw new Error('Invalid API key or access denied. Please check your API key.');
      }
      if (response.status === 404) {
        throw new Error('API endpoint not found. The service might be unavailable.');
      }
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response received:', data);
    return data;
  } catch (error) {
    console.error('🚨 API Request Error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API. Please check your internet connection.');
    }
    throw error;
  }
};

// Competition/League data - Updated to use correct endpoints
export const getCompetitions = async () => {
  return apiRequest('/competitions');
};

export const getCompetitionStandings = async (competitionCode: string) => {
  return apiRequest(`/competitions/${competitionCode}/standings`);
};

// Match data - Updated to use correct endpoints from documentation
export const getTodaysMatches = async () => {
  const today = new Date().toISOString().split('T')[0];
  return apiRequest(`/matches?dateFrom=${today}&dateTo=${today}`);
};

export const getUpcomingMatches = async (days: number = 7) => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  const dateFrom = today.toISOString().split('T')[0];
  const dateTo = futureDate.toISOString().split('T')[0];
  return apiRequest(`/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
};

export const getMatchesByCompetition = async (competitionCode: string) => {
  return apiRequest(`/competitions/${competitionCode}/matches`);
};

// Team data
export const getTeamDetails = async (teamId: string) => {
  return apiRequest(`/teams/${teamId}`);
};

export const getTeamMatches = async (teamId: string) => {
  return apiRequest(`/teams/${teamId}/matches`);
};

// Premier League specific (Code: PL)
export const getPremierLeagueStandings = async () => {
  return getCompetitionStandings('PL');
};

export const getPremierLeagueMatches = async () => {
  return getMatchesByCompetition('PL');
};

// Champions League specific (Code: CL)
export const getChampionsLeagueStandings = async () => {
  return getCompetitionStandings('CL');
};

export const getChampionsLeagueMatches = async () => {
  return getMatchesByCompetition('CL');
};

// Test API connection
export const testApiConnection = async () => {
  try {
    // Try the simplest endpoint first
    const data = await apiRequest('/competitions/PL'); // Premier League only
    console.log('✅ API connection successful!', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Export all functions
export const footballApi = {
  getCompetitions,
  getCompetitionStandings,
  getTodaysMatches,
  getUpcomingMatches,
  getMatchesByCompetition,
  getTeamDetails,
  getTeamMatches,
  getPremierLeagueStandings,
  getPremierLeagueMatches,
  getChampionsLeagueStandings,
  getChampionsLeagueMatches,
  testApiConnection,
};

export default footballApi;