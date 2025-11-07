import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw, Clock, Trophy, Target, AlertCircle, Wifi, WifiOff, Filter, Search, BarChart3 } from 'lucide-react';
import { footballApi } from '../services/footballApi';
import { Match } from '../types/football';

interface LiveScoresState {
  matches: Match[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  autoRefresh: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

interface MatchFilters {
  competition: string;
  status: string;
  searchTerm: string;
}

const EnhancedLiveScores: React.FC = () => {
  const [state, setState] = useState<LiveScoresState>({
    matches: [],
    loading: true,
    error: null,
    lastUpdated: null,
    autoRefresh: true,
    connectionStatus: 'connecting'
  });

  const [filters, setFilters] = useState<MatchFilters>({
    competition: 'all',
    status: 'all',
    searchTerm: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch matches data
  const fetchMatches = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, connectionStatus: 'connecting' }));
      
      console.log('🔄 Fetching live matches...');
      
      // Get today's matches and Premier League matches
      const [todayMatches, premierLeagueMatches] = await Promise.allSettled([
        footballApi.getTodaysMatches(),
        footballApi.getPremierLeagueMatches()
      ]);
      
      console.log('📅 Today matches response:', todayMatches);
      console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League matches response:', premierLeagueMatches);
      
      // Combine all matches
      let allMatches: Match[] = [];
      
      // Process today's matches
      if (todayMatches.status === 'fulfilled' && todayMatches.value?.matches) {
        allMatches = [...allMatches, ...todayMatches.value.matches];
      }
      
      // Process Premier League matches
      if (premierLeagueMatches.status === 'fulfilled' && premierLeagueMatches.value?.matches) {
        // Filter out duplicates and add recent Premier League matches
        const plMatchesFiltered = premierLeagueMatches.value.matches
          .filter((match: Match) => !allMatches.find(existing => existing.id === match.id))
          .slice(0, 20); // Get recent 20 matches
        allMatches = [...allMatches, ...plMatchesFiltered];
      }
      
      // Remove duplicates based on match ID
      const uniqueMatches = allMatches.filter((match, index, self) => 
        index === self.findIndex(m => m.id === match.id)
      );
      
      // Sort matches by date (most recent first)
      uniqueMatches.sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());
      
      console.log('⚽ Processed matches:', uniqueMatches.length);
      
      setState(prev => ({
        ...prev,
        matches: uniqueMatches,
        loading: false,
        error: null,
        lastUpdated: new Date(),
        connectionStatus: 'connected'
      }));
      
    } catch (error) {
      console.error('❌ Error fetching matches:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load matches',
        connectionStatus: 'disconnected'
      }));
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchMatches();
    
    let interval: NodeJS.Timeout;
    if (state.autoRefresh) {
      interval = setInterval(fetchMatches, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchMatches, state.autoRefresh]);

  // Filter matches based on competition, status, and search term
  const filteredMatches = state.matches.filter(match => {
    const competitionFilter = filters.competition === 'all' || 
      match.competition?.code === filters.competition ||
      match.competition?.name?.toLowerCase().includes(filters.competition.toLowerCase());
    
    const statusFilter = filters.status === 'all' || match.status === filters.status;
    
    const searchFilter = filters.searchTerm === '' ||
      match.homeTeam?.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      match.awayTeam?.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      match.competition?.name?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return competitionFilter && statusFilter && searchFilter;
  });

  // Group matches by competition
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const competition = match.competition?.name || 'Other';
    if (!groups[competition]) {
      groups[competition] = [];
    }
    groups[competition].push(match);
    return groups;
  }, {} as Record<string, Match[]>);

  // Get match statistics
  const getMatchStats = () => {
    const total = state.matches.length;
    const live = state.matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PLAY').length;
    const finished = state.matches.filter(m => m.status === 'FINISHED').length;
    const scheduled = state.matches.filter(m => m.status === 'SCHEDULED').length;
    
    return { total, live, finished, scheduled };
  };

  const stats = getMatchStats();

  const toggleAutoRefresh = () => {
    setState(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }));
  };

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case 'LIVE':
      case 'IN_PLAY':
        return <Play className="w-4 h-4 text-green-400" />;
      case 'PAUSED':
        return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'FINISHED':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
      case 'IN_PLAY':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'PAUSED':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'FINISHED':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default:
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    }
  };

  const formatMatchTime = (utcDate: string) => {
    try {
      const date = new Date(utcDate);
      const now = new Date();
      const diffHours = Math.abs(date.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch {
      return 'TBD';
    }
  };

  const formatLastUpdated = () => {
    if (!state.lastUpdated) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - state.lastUpdated.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return state.lastUpdated.toLocaleTimeString();
  };

  const getCompetitionIcon = (competition: string) => {
    if (competition.toLowerCase().includes('premier')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    if (competition.toLowerCase().includes('champions')) return '🏆';
    if (competition.toLowerCase().includes('europa')) return '🇪🇺';
    if (competition.toLowerCase().includes('world')) return '🌍';
    return '⚽';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enhanced Live Scores</h1>
          <p className="text-gray-400">Real-time football match updates with advanced features</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
            state.connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            state.connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {state.connectionStatus === 'connected' ? <Wifi className="w-4 h-4" /> :
             state.connectionStatus === 'connecting' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
             <WifiOff className="w-4 h-4" />}
            {state.connectionStatus}
          </div>

          {/* Auto-refresh Toggle */}
          <button
            onClick={toggleAutoRefresh}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              state.autoRefresh 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${state.autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh
          </button>

          {/* Manual Refresh */}
          <button
            onClick={fetchMatches}
            disabled={state.loading}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${state.loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-all duration-200"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Matches</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Live Now</p>
              <p className="text-2xl font-bold text-green-400">{stats.live}</p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Finished</p>
              <p className="text-2xl font-bold text-gray-400">{stats.finished}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Scheduled</p>
              <p className="text-2xl font-bold text-blue-400">{stats.scheduled}</p>
            </div>
            <Trophy className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Filters & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Teams</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  placeholder="Search teams or competitions..."
                  className="bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Competition Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition</label>
              <select
                value={filters.competition}
                onChange={(e) => setFilters(prev => ({ ...prev, competition: e.target.value }))}
                className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Competitions</option>
                <option value="PL">Premier League</option>
                <option value="CL">Champions League</option>
                <option value="EL">Europa League</option>
                <option value="WC">World Cup</option>
                <option value="EC">European Championship</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Match Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="LIVE">Live</option>
                <option value="IN_PLAY">In Play</option>
                <option value="FINISHED">Finished</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="TIMED">Timed</option>
                <option value="PAUSED">Paused</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>Showing {filteredMatches.length} of {state.matches.length} matches</span>
            <span>Last updated: {formatLastUpdated()}</span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-red-400 font-medium">Failed to Load Matches</h3>
              <p className="text-red-300 text-sm mt-1">{state.error}</p>
            </div>
          </div>
          <button
            onClick={fetchMatches}
            className="mt-4 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {state.loading && filteredMatches.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-white font-medium mb-2">Loading Matches</h3>
          <p className="text-gray-400">Fetching the latest football data...</p>
        </motion.div>
      )}

      {/* Matches Grouped by Competition */}
      {Object.entries(groupedMatches).map(([competition, matches], index) => (
        <motion.div
          key={competition}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{getCompetitionIcon(competition)}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{competition}</h2>
              <p className="text-sm text-gray-400">{matches.length} matches</p>
            </div>
          </div>

          <div className="space-y-4">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Match Status */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getMatchStatusColor(match.status)}`}>
                      {getMatchStatusIcon(match.status)}
                      {match.status}
                    </div>
                    
                    {/* Match Time */}
                    <div className="text-sm text-gray-400 font-medium">
                      {formatMatchTime(match.utcDate)}
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Matchday {match.matchday || 'TBD'}</div>
                    {/* Conditional group info if available */}
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  {/* Home Team */}
                  <div className="text-right">
                    <div className="font-semibold text-white text-lg">{match.homeTeam?.name || 'TBD'}</div>
                    <div className="text-sm text-gray-400">{match.homeTeam?.tla}</div>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      <span className={match.score?.fullTime?.home !== null ? 'text-white' : 'text-gray-500'}>
                        {match.score?.fullTime?.home ?? '-'}
                      </span>
                      <span className="text-gray-400 mx-2">:</span>
                      <span className={match.score?.fullTime?.away !== null ? 'text-white' : 'text-gray-500'}>
                        {match.score?.fullTime?.away ?? '-'}
                      </span>
                    </div>
                    {match.score?.halfTime && (
                      <div className="text-sm text-gray-400">
                        HT: {match.score.halfTime.home} - {match.score.halfTime.away}
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="text-left">
                    <div className="font-semibold text-white text-lg">{match.awayTeam?.name || 'TBD'}</div>
                    <div className="text-sm text-gray-400">{match.awayTeam?.tla}</div>
                  </div>
                </div>

                {/* Additional Match Info */}
                <div className="mt-4 pt-4 border-t border-slate-600/50 flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{match.stage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Empty State */}
      {!state.loading && filteredMatches.length === 0 && !state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-12 text-center"
        >
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2 text-xl">No Matches Found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your filters or search terms.</p>
          <button
            onClick={() => setFilters({ competition: 'all', status: 'all', searchTerm: '' })}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-6 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedLiveScores;