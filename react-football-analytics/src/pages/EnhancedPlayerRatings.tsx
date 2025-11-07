import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, TrendingDown, User, Target, Shield, Zap, Search, BarChart } from 'lucide-react';

interface PlayerRating {
  id: string;
  name: string;
  team: string;
  position: string;
  nationality: string;
  age: number;
  overallRating: number;
  stats: {
    goals: number;
    assists: number;
    matches: number;
    minutesPlayed: number;
    passAccuracy: number;
    tacklesToWon: number;
    savesPerGame?: number;
  };
  ratings: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  form: number;
  marketValue: string;
  trend: 'up' | 'down' | 'stable';
}

interface PlayerRatingsState {
  players: PlayerRating[];
  filteredPlayers: PlayerRating[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  positionFilter: string;
  teamFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const EnhancedPlayerRatings: React.FC = () => {
  const [state, setState] = useState<PlayerRatingsState>({
    players: [],
    filteredPlayers: [],
    loading: true,
    error: null,
    searchTerm: '',
    positionFilter: 'all',
    teamFilter: 'all',
    sortBy: 'overallRating',
    sortOrder: 'desc'
  });

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerRating | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock player data (in real app, this would come from API)
  const generateMockPlayers = useCallback((): PlayerRating[] => {
    const teams = ['Manchester City', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester United', 'Newcastle', 'Tottenham', 'Brighton'];
    const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
    const names = [
      'Erling Haaland', 'Mohamed Salah', 'Kevin De Bruyne', 'Virgil van Dijk', 'Bukayo Saka',
      'Bruno Fernandes', 'Harry Kane', 'Sadio Mané', 'Raheem Sterling', 'Mason Mount',
      'Declan Rice', 'Marcus Rashford', 'Jadon Sancho', 'Phil Foden', 'Jack Grealish',
      'Trent Alexander-Arnold', 'Andrew Robertson', 'Thiago Silva', 'N\'Golo Kanté', 'Casemiro'
    ];

    return names.map((name, index) => ({
      id: `player-${index}`,
      name,
      team: teams[Math.floor(Math.random() * teams.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      nationality: ['England', 'Brazil', 'Argentina', 'Spain', 'France', 'Germany', 'Netherlands', 'Portugal'][Math.floor(Math.random() * 8)],
      age: 20 + Math.floor(Math.random() * 15),
      overallRating: 75 + Math.floor(Math.random() * 25),
      stats: {
        goals: Math.floor(Math.random() * 25),
        assists: Math.floor(Math.random() * 15),
        matches: 10 + Math.floor(Math.random() * 20),
        minutesPlayed: 800 + Math.floor(Math.random() * 1500),
        passAccuracy: 70 + Math.floor(Math.random() * 25),
        tacklesToWon: Math.floor(Math.random() * 50),
        savesPerGame: Math.random() * 5
      },
      ratings: {
        pace: 60 + Math.floor(Math.random() * 40),
        shooting: 50 + Math.floor(Math.random() * 50),
        passing: 60 + Math.floor(Math.random() * 40),
        dribbling: 50 + Math.floor(Math.random() * 50),
        defending: 40 + Math.floor(Math.random() * 60),
        physical: 60 + Math.floor(Math.random() * 40)
      },
      form: 1 + Math.random() * 9,
      marketValue: `£${(10 + Math.random() * 100).toFixed(1)}M`,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    }));
  }, []);

  const fetchPlayerRatings = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // In a real app, this would fetch from the API
      // For now, we'll use mock data
      const mockPlayers = generateMockPlayers();
      
      setState(prev => ({
        ...prev,
        players: mockPlayers,
        filteredPlayers: mockPlayers,
        loading: false
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load player ratings'
      }));
    }
  }, [generateMockPlayers]);

  useEffect(() => {
    fetchPlayerRatings();
  }, [fetchPlayerRatings]);

  // Filter and sort players
  useEffect(() => {
    let filtered = state.players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                           player.team.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchesPosition = state.positionFilter === 'all' || player.position === state.positionFilter;
      const matchesTeam = state.teamFilter === 'all' || player.team === state.teamFilter;
      
      return matchesSearch && matchesPosition && matchesTeam;
    });

    // Sort players
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (state.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'overallRating':
          aValue = a.overallRating;
          bValue = b.overallRating;
          break;
        case 'goals':
          aValue = a.stats.goals;
          bValue = b.stats.goals;
          break;
        case 'assists':
          aValue = a.stats.assists;
          bValue = b.stats.assists;
          break;
        case 'form':
          aValue = a.form;
          bValue = b.form;
          break;
        default:
          aValue = a.overallRating;
          bValue = b.overallRating;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return state.sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return state.sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

    setState(prev => ({ ...prev, filteredPlayers: filtered }));
  }, [state.players, state.searchTerm, state.positionFilter, state.teamFilter, state.sortBy, state.sortOrder]);

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'text-green-400 bg-green-400/10';
    if (rating >= 80) return 'text-blue-400 bg-blue-400/10';
    if (rating >= 70) return 'text-yellow-400 bg-yellow-400/10';
    if (rating >= 60) return 'text-orange-400 bg-orange-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getPositionIcon = (position: string) => {
    if (position === 'GK') return <Shield className="w-4 h-4" />;
    if (['CB', 'LB', 'RB'].includes(position)) return <Shield className="w-4 h-4" />;
    if (['CDM', 'CM', 'CAM'].includes(position)) return <Zap className="w-4 h-4" />;
    if (['LW', 'RW', 'ST'].includes(position)) return <Target className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const stars = Math.round(rating / 20); // Convert 0-100 to 0-5 stars
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  const RadarChart = ({ ratings }: { ratings: PlayerRating['ratings'] }) => {
    const attributes = Object.keys(ratings);
    const values = Object.values(ratings);
    
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Background grid */}
          <g className="opacity-20">
            {[20, 40, 60, 80, 100].map(radius => (
              <polygon
                key={radius}
                points="60,10 93,25 103,60 93,95 60,110 27,95 17,60 27,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                transform={`scale(${radius / 100})`}
                style={{ transformOrigin: '60px 60px' }}
              />
            ))}
            {attributes.map((_, i) => (
              <line
                key={i}
                x1="60"
                y1="60"
                x2={60 + 40 * Math.cos((i * 2 * Math.PI) / 6 - Math.PI / 2)}
                y2={60 + 40 * Math.sin((i * 2 * Math.PI) / 6 - Math.PI / 2)}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </g>
          
          {/* Player stats */}
          <polygon
            points={values.map((value, i) => {
              const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
              const radius = (value / 100) * 40;
              return `${60 + radius * Math.cos(angle)},${60 + radius * Math.sin(angle)}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
          />
        </svg>
        
        {/* Labels */}
        <div className="absolute inset-0 text-xs text-gray-400">
          {attributes.map((attr, i) => {
            const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
            const x = 50 + 45 * Math.cos(angle);
            const y = 50 + 45 * Math.sin(angle);
            return (
              <div
                key={attr}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {attr.slice(0, 3)}
              </div>
            );
          })}
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-white mb-2">Enhanced Player Ratings</h1>
          <p className="text-gray-400">Advanced player analysis with performance metrics</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Toggle */}
          <div className="bg-slate-700/50 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={fetchPlayerRatings}
            disabled={state.loading}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <BarChart className={`w-4 h-4 ${state.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                placeholder="Search players..."
                className="bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Position Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
            <select
              value={state.positionFilter}
              onChange={(e) => setState(prev => ({ ...prev, positionFilter: e.target.value }))}
              className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Positions</option>
              <option value="GK">Goalkeeper</option>
              <option value="CB">Centre Back</option>
              <option value="LB">Left Back</option>
              <option value="RB">Right Back</option>
              <option value="CDM">Defensive Mid</option>
              <option value="CM">Central Mid</option>
              <option value="CAM">Attacking Mid</option>
              <option value="LW">Left Wing</option>
              <option value="RW">Right Wing</option>
              <option value="ST">Striker</option>
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
            <select
              value={state.teamFilter}
              onChange={(e) => setState(prev => ({ ...prev, teamFilter: e.target.value }))}
              className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Teams</option>
              {Array.from(new Set(state.players.map(p => p.team))).map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={state.sortBy}
              onChange={(e) => setState(prev => ({ ...prev, sortBy: e.target.value }))}
              className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="overallRating">Overall Rating</option>
              <option value="name">Name</option>
              <option value="goals">Goals</option>
              <option value="assists">Assists</option>
              <option value="form">Form</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
            <select
              value={state.sortOrder}
              onChange={(e) => setState(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
              className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Highest First</option>
              <option value="asc">Lowest First</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing {state.filteredPlayers.length} of {state.players.length} players
        </div>
      </motion.div>

      {/* Error State */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
        >
          <p className="text-red-400">{state.error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {state.loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <BarChart className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-white font-medium mb-2">Loading Player Ratings</h3>
          <p className="text-gray-400">Analyzing player performance data...</p>
        </motion.div>
      )}

      {/* Players Grid/List */}
      {!state.loading && !state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={viewMode === 'grid' ? 
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 
            'space-y-4'
          }
        >
          {state.filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setSelectedPlayer(player)}
              className={`glass rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-blue-500/50 ${
                viewMode === 'list' ? 'flex items-center gap-6' : ''
              }`}
            >
              {/* Player Header */}
              <div className={viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-2 ${getRatingColor(player.overallRating)} px-3 py-1 rounded-full text-sm font-bold`}>
                    {getPositionIcon(player.position)}
                    {player.overallRating}
                  </div>
                  {getTrendIcon(player.trend)}
                </div>
                
                <h3 className="text-lg font-bold text-white">{player.name}</h3>
                <p className="text-sm text-gray-400">{player.team} • {player.position}</p>
                <p className="text-xs text-gray-500">{player.nationality} • {player.age} years</p>
              </div>

              {/* Player Stats */}
              {viewMode === 'grid' ? (
                <>
                  <div className="mb-4">
                    <StarRating rating={player.overallRating} />
                    <div className="text-xs text-gray-400 mt-1">Form: {player.form.toFixed(1)}/10</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="bg-slate-700/30 rounded p-2">
                      <div className="text-xs text-gray-400">Goals</div>
                      <div className="font-bold text-white">{player.stats.goals}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded p-2">
                      <div className="text-xs text-gray-400">Assists</div>
                      <div className="font-bold text-white">{player.stats.assists}</div>
                    </div>
                  </div>

                  <RadarChart ratings={player.ratings} />

                  <div className="mt-4 text-center">
                    <div className="text-sm font-medium text-blue-400">{player.marketValue}</div>
                    <div className="text-xs text-gray-400">Market Value</div>
                  </div>
                </>
              ) : (
                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                  <div>
                    <StarRating rating={player.overallRating} />
                    <div className="text-xs text-gray-400 mt-1">Form: {player.form.toFixed(1)}/10</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{player.stats.goals}</div>
                    <div className="text-xs text-gray-400">Goals</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{player.stats.assists}</div>
                    <div className="text-xs text-gray-400">Assists</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-400">{player.marketValue}</div>
                    <div className="text-xs text-gray-400">Value</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!state.loading && !state.error && state.filteredPlayers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-12 text-center"
        >
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2 text-xl">No Players Found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your filters or search terms.</p>
          <button
            onClick={() => setState(prev => ({ 
              ...prev, 
              searchTerm: '', 
              positionFilter: 'all', 
              teamFilter: 'all' 
            }))}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-6 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPlayer(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}</h2>
                <p className="text-gray-400">{selectedPlayer.team} • {selectedPlayer.position}</p>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Player Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Goals:</span>
                    <span className="text-white font-medium">{selectedPlayer.stats.goals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assists:</span>
                    <span className="text-white font-medium">{selectedPlayer.stats.assists}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Matches:</span>
                    <span className="text-white font-medium">{selectedPlayer.stats.matches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pass Accuracy:</span>
                    <span className="text-white font-medium">{selectedPlayer.stats.passAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Value:</span>
                    <span className="text-blue-400 font-medium">{selectedPlayer.marketValue}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Attribute Ratings</h3>
                <RadarChart ratings={selectedPlayer.ratings} />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Detailed Ratings</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(selectedPlayer.ratings).map(([attr, value]) => (
                  <div key={attr} className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-gray-400 capitalize">{attr}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-full rounded-full" 
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-white font-medium text-sm">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedPlayerRatings;
