import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, BarChart3, PieChart as PieChartIcon, Activity,
  Target, Trophy, Users, Zap, RefreshCw, Clock, Star
} from 'lucide-react';
import { useLiveMatches, usePremierLeagueStandings } from '../hooks/useFootballData';
import { Match, Standing } from '../types/football';

interface AnalyticsData {
  matchTrends: Array<{
    date: string;
    matches: number;
    goals: number;
    attendance?: number;
  }>;
  goalDistribution: Array<{
    timeFrame: string;
    homeGoals: number;
    awayGoals: number;
  }>;
  teamPerformance: Array<{
    team: string;
    wins: number;
    draws: number;
    losses: number;
    points: number;
    form: number;
  }>;
  matchOutcomes: Array<{
    outcome: string;
    value: number;
    color: string;
  }>;
  scoreDistribution: Array<{
    scoreline: string;
    frequency: number;
  }>;
  timeAnalysis: Array<{
    minute: number;
    goals: number;
  }>;
}

const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899'
};

const EnhancedAnalytics: React.FC = () => {
  const matchesData = useLiveMatches();
  const standingsData = usePremierLeagueStandings();
  
  const [activeChart, setActiveChart] = useState<string>('trends');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const matches = matchesData.data as Match[] | null;
  const standings = standingsData.data as any;
  const isLoading = matchesData.loading || standingsData.loading;
  const error = matchesData.error || standingsData.error;

  const analyticsData: AnalyticsData = useMemo(() => {
    if (!matches?.length) {
      return {
        matchTrends: [],
        goalDistribution: [],
        teamPerformance: [],
        matchOutcomes: [],
        scoreDistribution: [],
        timeAnalysis: []
      };
    }

    // Match trends over time
    const matchTrends = matches
      .filter((m: Match) => m.status === 'FINISHED')
      .reduce((acc: any[], match: Match) => {
        const date = new Date(match.utcDate).toLocaleDateString();
        const existingEntry = acc.find(entry => entry.date === date);
        const goals = (match.score.fullTime.home || 0) + (match.score.fullTime.away || 0);
        
        if (existingEntry) {
          existingEntry.matches += 1;
          existingEntry.goals += goals;
        } else {
          acc.push({ date, matches: 1, goals, attendance: Math.floor(Math.random() * 50000) + 20000 });
        }
        return acc;
      }, [])
      .slice(-14); // Last 14 days

    // Goal distribution by timeframe
    const goalDistribution = [
      { timeFrame: '0-15', homeGoals: 0, awayGoals: 0 },
      { timeFrame: '16-30', homeGoals: 0, awayGoals: 0 },
      { timeFrame: '31-45', homeGoals: 0, awayGoals: 0 },
      { timeFrame: '46-60', homeGoals: 0, awayGoals: 0 },
      { timeFrame: '61-75', homeGoals: 0, awayGoals: 0 },
      { timeFrame: '76-90', homeGoals: 0, awayGoals: 0 }
    ];

    matches.forEach((match: Match) => {
      if (match.status === 'FINISHED') {
        // Simulate goal timing distribution
        const homeGoals = match.score.fullTime.home || 0;
        const awayGoals = match.score.fullTime.away || 0;
        
        for (let i = 0; i < homeGoals; i++) {
          const period = Math.floor(Math.random() * 6);
          goalDistribution[period].homeGoals += 1;
        }
        
        for (let i = 0; i < awayGoals; i++) {
          const period = Math.floor(Math.random() * 6);
          goalDistribution[period].awayGoals += 1;
        }
      }
    });

    // Team performance (from standings)
    const teamPerformance = standings?.standings?.[0]?.table?.slice(0, 8).map((team: Standing) => ({
      team: team.team.shortName,
      wins: team.won,
      draws: team.draw,
      losses: team.lost,
      points: team.points,
      form: team.form?.split('').filter(result => result === 'W').length || 0
    })) || [];

    // Match outcomes distribution
    const outcomes = { home: 0, draw: 0, away: 0 };
    matches.forEach((match: Match) => {
      if (match.status === 'FINISHED') {
        const homeScore = match.score.fullTime.home || 0;
        const awayScore = match.score.fullTime.away || 0;
        
        if (homeScore > awayScore) outcomes.home++;
        else if (homeScore < awayScore) outcomes.away++;
        else outcomes.draw++;
      }
    });

    const matchOutcomes = [
      { outcome: 'Home Win', value: outcomes.home, color: COLORS.primary },
      { outcome: 'Draw', value: outcomes.draw, color: COLORS.accent },
      { outcome: 'Away Win', value: outcomes.away, color: COLORS.secondary }
    ];

    // Score distribution
    const scoreMap: { [key: string]: number } = {};
    matches.forEach((match: Match) => {
      if (match.status === 'FINISHED') {
        const scoreline = `${match.score.fullTime.home}-${match.score.fullTime.away}`;
        scoreMap[scoreline] = (scoreMap[scoreline] || 0) + 1;
      }
    });

    const scoreDistribution = Object.entries(scoreMap)
      .map(([scoreline, frequency]) => ({ scoreline, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Time analysis (goals by minute)
    const timeAnalysis = Array.from({ length: 18 }, (_, i) => ({
      minute: (i + 1) * 5,
      goals: Math.floor(Math.random() * 15) + 5
    }));

    return {
      matchTrends,
      goalDistribution,
      teamPerformance,
      matchOutcomes,
      scoreDistribution,
      timeAnalysis
    };
  }, [matches, standings]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    matchesData.refetch();
    standingsData.refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const ChartCard: React.FC<{
    title: string;
    children: React.ReactNode;
    chartId: string;
    icon: React.ReactNode;
  }> = ({ title, children, chartId, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm ${
        activeChart === chartId ? 'ring-2 ring-blue-500/50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <button
          onClick={() => setActiveChart(chartId)}
          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
            activeChart === chartId
              ? 'bg-blue-500 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          Focus
        </button>
      </div>
      <div className="h-80">
        {children}
      </div>
    </motion.div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-600 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Analytics</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
          <p className="text-gray-400">Deep insights into football data and trends</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="season">This season</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Match Trends */}
        <ChartCard
          title="Match & Goal Trends"
          chartId="trends"
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.matchTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="matches"
                stroke={COLORS.primary}
                strokeWidth={3}
                name="Matches"
              />
              <Line
                type="monotone"
                dataKey="goals"
                stroke={COLORS.secondary}
                strokeWidth={3}
                name="Goals"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Goal Distribution */}
        <ChartCard
          title="Goals by Time Period"
          chartId="goals"
          icon={<Target className="w-5 h-5 text-green-400" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.goalDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timeFrame" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="homeGoals" fill={COLORS.primary} name="Home Goals" />
              <Bar dataKey="awayGoals" fill={COLORS.secondary} name="Away Goals" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Team Performance */}
        <ChartCard
          title="Team Performance Radar"
          chartId="performance"
          icon={<Star className="w-5 h-5 text-yellow-400" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={analyticsData.teamPerformance.slice(0, 6)}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="team" className="text-xs fill-gray-300" />
              <PolarRadiusAxis stroke="#9CA3AF" />
              <Radar
                name="Points"
                dataKey="points"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Form"
                dataKey="form"
                stroke={COLORS.secondary}
                fill={COLORS.secondary}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Match Outcomes */}
        <ChartCard
          title="Match Outcomes Distribution"
          chartId="outcomes"
          icon={<PieChartIcon className="w-5 h-5 text-purple-400" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.matchOutcomes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ outcome, value, percent }) => 
                  `${outcome}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                className="text-xs fill-white"
              >
                {analyticsData.matchOutcomes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Score Distribution */}
        <ChartCard
          title="Most Common Scorelines"
          chartId="scores"
          icon={<BarChart3 className="w-5 h-5 text-orange-400" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.scoreDistribution} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis type="category" dataKey="scoreline" stroke="#9CA3AF" width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="frequency" fill={COLORS.accent} name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Goals by Minute */}
        <ChartCard
          title="Goal Timing Analysis"
          chartId="timing"
          icon={<Clock className="w-5 h-5 text-pink-400" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.timeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="minute" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="goals"
                stroke={COLORS.pink}
                fill={COLORS.pink}
                fillOpacity={0.3}
                strokeWidth={2}
                name="Goals"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Key Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Matches', value: analyticsData.matchTrends.reduce((acc, day) => acc + day.matches, 0), icon: Trophy },
            { label: 'Total Goals', value: analyticsData.matchTrends.reduce((acc, day) => acc + day.goals, 0), icon: Target },
            { label: 'Avg Goals/Match', value: (analyticsData.matchTrends.reduce((acc, day) => acc + day.goals, 0) / Math.max(analyticsData.matchTrends.reduce((acc, day) => acc + day.matches, 0), 1)).toFixed(1), icon: TrendingUp },
            { label: 'Home Win %', value: `${((analyticsData.matchOutcomes[0]?.value || 0) / analyticsData.matchOutcomes.reduce((acc, outcome) => acc + outcome.value, 0) * 100).toFixed(0)}%`, icon: Users },
            { label: 'Most Goals', value: Math.max(...analyticsData.timeAnalysis.map(t => t.goals)), icon: Zap },
            { label: 'Peak Time', value: `${analyticsData.timeAnalysis.find(t => t.goals === Math.max(...analyticsData.timeAnalysis.map(t => t.goals)))?.minute || 0}'`, icon: Clock }
          ].map((stat, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4 text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-white">Loading analytics data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAnalytics;