import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Trophy, Clock, Target, 
  Activity, Star, ArrowRight, RefreshCw, Calendar,
  Play, Pause
} from 'lucide-react';
import { useLiveMatches, usePremierLeagueStandings } from '../hooks/useFootballData';
import { Match, Standing } from '../types/football';

interface DashboardStats {
  totalMatches: number;
  liveMatches: number;
  finishedMatches: number;
  scheduledMatches: number;
  totalGoals: number;
  averageGoals: number;
}

const EnhancedDashboard: React.FC = () => {
  const matchesData = useLiveMatches();
  const standingsData = usePremierLeagueStandings();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalMatches: 0,
    liveMatches: 0,
    finishedMatches: 0,
    scheduledMatches: 0,
    totalGoals: 0,
    averageGoals: 0
  });
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [topTeams, setTopTeams] = useState<Standing[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract matches data safely
  const matches = useMemo(() => {
    try {
      return (matchesData.data?.matches || []) as Match[];
    } catch (error) {
      console.error('Error extracting matches data:', error);
      return [] as Match[];
    }
  }, [matchesData.data]);

  // Extract standings data safely  
  const standings = useMemo(() => {
    try {
      return standingsData.data?.standings?.[0]?.table || [];
    } catch (error) {
      console.error('Error extracting standings data:', error);
      return [];
    }
  }, [standingsData.data]);

  const isLoading = matchesData.loading || standingsData.loading;
  const error = matchesData.error || standingsData.error;

  // Calculate dashboard statistics
  const calculateStats = useCallback(() => {
    try {
      if (!Array.isArray(matches) || matches.length === 0) {
        setStats({
          totalMatches: 0,
          liveMatches: 0,
          finishedMatches: 0,
          scheduledMatches: 0,
          totalGoals: 0,
          averageGoals: 0
        });
        return;
      }

      const totalMatches = matches.length;
      const liveMatches = matches.filter((m: Match) => 
        m.status === 'LIVE' || m.status === 'IN_PLAY' || m.status === 'PAUSED'
      ).length;
      const finishedMatches = matches.filter((m: Match) => 
        m.status === 'FINISHED'
      ).length;
      const scheduledMatches = matches.filter((m: Match) => 
        m.status === 'SCHEDULED'
      ).length;

      const finishedMatchesWithScores = matches.filter((m: Match) => 
        m.status === 'FINISHED' && 
        m.score?.fullTime?.home !== null && 
        m.score?.fullTime?.away !== null
      );

      const totalGoals = finishedMatchesWithScores.reduce((sum: number, match: Match) => 
        sum + (match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0), 0
      );

      const averageGoals = finishedMatchesWithScores.length > 0 
        ? totalGoals / finishedMatchesWithScores.length 
        : 0;

      setStats({
        totalMatches,
        liveMatches,
        finishedMatches,
        scheduledMatches,
        totalGoals,
        averageGoals
      });

      // Set recent matches (last 6 finished matches)
      const recent = matches
        .filter((m: Match) => m.status === 'FINISHED')
        .sort((a: Match, b: Match) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
        .slice(0, 6);
      setRecentMatches(recent);

    } catch (error) {
      console.error('Error calculating stats:', error);
      setStats({
        totalMatches: 0,
        liveMatches: 0,
        finishedMatches: 0,
        scheduledMatches: 0,
        totalGoals: 0,
        averageGoals: 0
      });
      setRecentMatches([]);
    }
  }, [matches]);

  // Get top teams from standings
  useEffect(() => {
    try {
      if (Array.isArray(standings) && standings.length > 0) {
        const topStandings = standings
          .sort((a: Standing, b: Standing) => a.position - b.position)
          .slice(0, 5);
        setTopTeams(topStandings);
      } else {
        setTopTeams([]);
      }
    } catch (error) {
      console.error('Error processing standings:', error);
      setTopTeams([]);
    }
  }, [standings]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    matchesData.refetch();
    standingsData.refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-xl border border-white/10 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-white/80 text-sm">{title}</p>
      </div>
    </motion.div>
  );

  const LiveMatchCard: React.FC<{ match: Match }> = ({ match }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>
        <span className="text-xs text-gray-400">{match.competition.name}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={match.homeTeam.crest} 
            alt={match.homeTeam.name}
            className="w-6 h-6"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-white font-medium text-sm">{match.homeTeam.shortName}</span>
        </div>
        
        <div className="px-3 py-1 bg-slate-700 rounded text-white font-bold">
          {match.score.fullTime.home || 0} - {match.score.fullTime.away || 0}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-sm">{match.awayTeam.shortName}</span>
          <img 
            src={match.awayTeam.crest} 
            alt={match.awayTeam.name}
            className="w-6 h-6"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
    </motion.div>
  );

  const RecentMatchCard: React.FC<{ match: Match }> = ({ match }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <img 
            src={match.homeTeam.crest} 
            alt={match.homeTeam.name}
            className="w-5 h-5"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-white text-sm font-medium truncate">{match.homeTeam.shortName}</span>
        </div>
        
        <div className="px-2 py-1 bg-slate-700 rounded text-white text-sm font-bold mx-2">
          {match.score.fullTime.home} - {match.score.fullTime.away}
        </div>
        
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-white text-sm font-medium truncate">{match.awayTeam.shortName}</span>
          <img 
            src={match.awayTeam.crest} 
            alt={match.awayTeam.name}
            className="w-5 h-5"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-2 text-center">
        {new Date(match.utcDate).toLocaleDateString()}
      </div>
    </motion.div>
  );

  const TopTeamCard: React.FC<{ team: Standing; index: number }> = ({ team, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-600/30"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        index === 0 ? 'bg-yellow-500 text-black' :
        index === 1 ? 'bg-gray-400 text-black' :
        index === 2 ? 'bg-amber-600 text-white' :
        'bg-slate-600 text-white'
      }`}>
        {team.position}
      </div>
      
      <img 
        src={team.team.crest} 
        alt={team.team.name}
        className="w-6 h-6"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm">{team.team.shortName}</h4>
        <p className="text-gray-400 text-xs">{team.points} pts</p>
      </div>
      
      <div className="text-right">
        <div className="text-white text-sm font-bold">{team.won}-{team.draw}-{team.lost}</div>
        <div className="text-gray-400 text-xs">W-D-L</div>
      </div>
    </motion.div>
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Dashboard</h3>
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

  const liveMatches = matches?.filter(m => m.status === 'LIVE' || m.status === 'IN_PLAY') || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Overview of your football analytics</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Matches"
          value={stats.totalMatches}
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Live Matches"
          value={stats.liveMatches}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Total Goals"
          value={stats.totalGoals}
          icon={<Target className="w-6 h-6 text-white" />}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Avg Goals/Match"
          value={stats.averageGoals.toFixed(1)}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Matches */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-green-400" />
                Live Matches
              </h2>
              <span className="text-sm text-gray-400">{liveMatches.length} live</span>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-700/50 rounded-lg h-20 animate-pulse"></div>
                ))}
              </div>
            ) : liveMatches.length > 0 ? (
              <div className="space-y-4">
                {liveMatches.slice(0, 4).map((match) => (
                  <LiveMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Pause className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No live matches at the moment</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Teams */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Top Teams */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Top Teams
            </h2>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-slate-700/50 rounded-lg h-16 animate-pulse"></div>
                ))}
              </div>
            ) : topTeams.length > 0 ? (
              <div className="space-y-3">
                {topTeams.map((team, index) => (
                  <TopTeamCard key={team.team.id} team={team} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No standings data</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Matches */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Recent Results
          </h2>
          <span className="text-sm text-gray-400">{recentMatches.length} matches</span>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-700/50 rounded-lg h-20 animate-pulse"></div>
            ))}
          </div>
        ) : recentMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMatches.map((match) => (
              <RecentMatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent matches available</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { title: 'Live Scores', icon: Activity, path: '/live-scores' },
          { title: 'Statistics', icon: BarChart3, path: '/statistics' },
          { title: 'Player Ratings', icon: Star, path: '/player-ratings' },
          { title: 'Analytics', icon: TrendingUp, path: '/analytics' }
        ].map((action) => (
          <motion.button
            key={action.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <action.icon className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">{action.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default EnhancedDashboard;