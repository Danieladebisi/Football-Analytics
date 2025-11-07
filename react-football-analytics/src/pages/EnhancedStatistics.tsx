import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Trophy, Target, Shield, TrendingUp, TrendingDown, Users, Award, Filter, Download, RefreshCw } from 'lucide-react';
import { footballApi } from '../services/footballApi';

interface TeamStanding {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string;
}

interface StatisticsData {
  standings: TeamStanding[];
  topScorers: Array<{
    player: { name: string; nationality: string; };
    team: { name: string; };
    goals: number;
    assists: number;
    matches: number;
  }>;
  loading: boolean;
  error: string | null;
}

const EnhancedStatistics: React.FC = () => {
  const [data, setData] = useState<StatisticsData>({
    standings: [],
    topScorers: [],
    loading: true,
    error: null
  });

  const [selectedLeague, setSelectedLeague] = useState<string>('PL');
  const [activeTab, setActiveTab] = useState<'standings' | 'scorers' | 'analytics' | 'trends'>('standings');
  const [showFilters, setShowFilters] = useState(false);

  const leagues = [
    { code: 'PL', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'CL', name: 'Champions League', flag: '🏆' },
    { code: 'EL', name: 'Europa League', flag: '🇪🇺' },
    { code: 'WC', name: 'World Cup', flag: '🌍' },
  ];

  const fetchData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch standings for Premier League
      const standingsResponse = await footballApi.getPremierLeagueStandings();
      console.log('📊 Standings response:', standingsResponse);

      // Extract standings data
      let standings: TeamStanding[] = [];
      if (standingsResponse?.standings?.[0]?.table) {
        standings = standingsResponse.standings[0].table;
      }

      // Mock top scorers data (since API might not have this)
      const mockTopScorers = [
        { player: { name: 'Erling Haaland', nationality: 'Norway' }, team: { name: 'Manchester City' }, goals: 18, assists: 5, matches: 12 },
        { player: { name: 'Mohamed Salah', nationality: 'Egypt' }, team: { name: 'Liverpool' }, goals: 15, assists: 8, matches: 13 },
        { player: { name: 'Harry Kane', nationality: 'England' }, team: { name: 'Bayern Munich' }, goals: 14, assists: 6, matches: 11 },
        { player: { name: 'Kylian Mbappé', nationality: 'France' }, team: { name: 'PSG' }, goals: 13, assists: 7, matches: 12 },
        { player: { name: 'Victor Osimhen', nationality: 'Nigeria' }, team: { name: 'Napoli' }, goals: 12, assists: 4, matches: 10 },
      ];

      setData({
        standings,
        topScorers: mockTopScorers,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load statistics'
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prepare chart data
  const prepareChartData = () => {
    const top10Teams = data.standings.slice(0, 10);
    
    return {
      pointsChart: top10Teams.map(team => ({
        name: team.team.tla,
        points: team.points,
        wins: team.won,
        draws: team.draw,
        losses: team.lost
      })),
      
      goalsChart: top10Teams.map(team => ({
        name: team.team.tla,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference: team.goalDifference
      })),

      formChart: top10Teams.map(team => ({
        name: team.team.tla,
        form: team.form ? team.form.split('').filter(f => f === 'W').length : 0,
        totalGames: team.playedGames
      })),

      performanceDistribution: [
        { name: 'Wins', value: data.standings.reduce((sum, team) => sum + team.won, 0), color: '#10B981' },
        { name: 'Draws', value: data.standings.reduce((sum, team) => sum + team.draw, 0), color: '#F59E0B' },
        { name: 'Losses', value: data.standings.reduce((sum, team) => sum + team.lost, 0), color: '#EF4444' }
      ]
    };
  };

  const chartData = prepareChartData();

  const getPositionTrend = (position: number) => {
    if (position <= 4) return { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (position <= 6) return { icon: Award, color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (position >= 18) return { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10' };
    return { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' };
  };

  const getFormColor = (form: string) => {
    const wins = form ? form.split('').filter(f => f === 'W').length : 0;
    const total = form ? form.length : 0;
    const winRate = total > 0 ? wins / total : 0;
    
    if (winRate >= 0.8) return 'text-green-400';
    if (winRate >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Statistics</h1>
          <p className="text-gray-400">Comprehensive football data analysis and insights</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* League Selector */}
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {leagues.map(league => (
              <option key={league.code} value={league.code}>
                {league.flag} {league.name}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={data.loading}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${data.loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Export Button */}
          <button className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-4"
      >
        <div className="flex flex-wrap gap-2">
          <TabButton id="standings" label="League Table" icon={Trophy} />
          <TabButton id="scorers" label="Top Scorers" icon={Target} />
          <TabButton id="analytics" label="Team Analytics" icon={BarChart} />
          <TabButton id="trends" label="Performance Trends" icon={TrendingUp} />
        </div>
      </motion.div>

      {/* Error State */}
      {data.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
        >
          <p className="text-red-400">{data.error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {data.loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-white font-medium mb-2">Loading Statistics</h3>
          <p className="text-gray-400">Fetching the latest data...</p>
        </motion.div>
      )}

      {/* Content based on active tab */}
      {!data.loading && !data.error && (
        <>
          {/* League Table */}
          {activeTab === 'standings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">League Table</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left text-gray-400 py-3">Pos</th>
                      <th className="text-left text-gray-400 py-3">Team</th>
                      <th className="text-center text-gray-400 py-3">MP</th>
                      <th className="text-center text-gray-400 py-3">W</th>
                      <th className="text-center text-gray-400 py-3">D</th>
                      <th className="text-center text-gray-400 py-3">L</th>
                      <th className="text-center text-gray-400 py-3">GF</th>
                      <th className="text-center text-gray-400 py-3">GA</th>
                      <th className="text-center text-gray-400 py-3">GD</th>
                      <th className="text-center text-gray-400 py-3">Pts</th>
                      <th className="text-center text-gray-400 py-3">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.standings.map((team, index) => {
                      const trend = getPositionTrend(team.position);
                      return (
                        <motion.tr
                          key={team.team.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{team.position}</span>
                              <trend.icon className={`w-4 h-4 ${trend.color}`} />
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              {team.team.crest && (
                                <img 
                                  src={team.team.crest} 
                                  alt={team.team.name}
                                  className="w-6 h-6 object-contain"
                                />
                              )}
                              <div>
                                <div className="font-medium text-white">{team.team.name}</div>
                                <div className="text-xs text-gray-400">{team.team.tla}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center text-gray-300">{team.playedGames}</td>
                          <td className="text-center text-green-400">{team.won}</td>
                          <td className="text-center text-yellow-400">{team.draw}</td>
                          <td className="text-center text-red-400">{team.lost}</td>
                          <td className="text-center text-blue-400">{team.goalsFor}</td>
                          <td className="text-center text-orange-400">{team.goalsAgainst}</td>
                          <td className={`text-center ${team.goalDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </td>
                          <td className="text-center font-bold text-white">{team.points}</td>
                          <td className="text-center">
                            <div className={`font-mono text-xs ${getFormColor(team.form)}`}>
                              {team.form || 'N/A'}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Top Scorers */}
          {activeTab === 'scorers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Top Scorers</h2>
              
              <div className="grid gap-4">
                {data.topScorers.map((scorer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/30 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-400 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-400 text-black' :
                        'bg-slate-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div>
                        <div className="font-semibold text-white">{scorer.player.name}</div>
                        <div className="text-sm text-gray-400">{scorer.team.name} • {scorer.player.nationality}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{scorer.goals}</div>
                      <div className="text-sm text-gray-400">{scorer.assists} assists</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Team Analytics */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Points Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.pointsChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }} 
                    />
                    <Bar dataKey="points" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Goals Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Goals For vs Against</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.goalsChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }} 
                    />
                    <Area type="monotone" dataKey="goalsFor" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="goalsAgainst" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Performance Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Results Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.performanceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Form Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Recent Form</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.formChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }} 
                    />
                    <Line type="monotone" dataKey="form" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* Performance Trends */}
          {activeTab === 'trends' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Performance Trends</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 text-sm">Avg Goals/Game</p>
                      <p className="text-2xl font-bold text-white">2.8</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 text-sm">Clean Sheets</p>
                      <p className="text-2xl font-bold text-white">45%</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-400 text-sm">Possession</p>
                      <p className="text-2xl font-bold text-white">58%</p>
                    </div>
                    <Users className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-400 text-sm">Shot Accuracy</p>
                      <p className="text-2xl font-bold text-white">67%</p>
                    </div>
                    <Award className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-400">
                <p>Detailed trend analysis coming soon...</p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default EnhancedStatistics;
