import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  Heart, 
  MessageCircle, 
  Share,
  BarChart3
} from 'lucide-react';
import ApiTestComponent from '../components/ApiTestComponent';

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: { name: 'Daniel', avatar: 'DA', points: 1250 },
      content: 'What an incredible match! Man City vs Arsenal was absolutely phenomenal. The tactical setup from both managers was masterful.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: '2',
      user: { name: 'Sarah_Football', avatar: 'SF', points: 890 },
      content: 'Haaland\'s performance this season is just unreal. 15 goals in 10 matches - we\'re witnessing history!',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      likes: 45,
      comments: 12,
      isLiked: true
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const liveMatches = [
    { id: '1', homeTeam: 'Man City', awayTeam: 'Arsenal', homeScore: 2, awayScore: 1, time: '67\'', status: 'live' },
    { id: '2', homeTeam: 'Liverpool', awayTeam: 'Chelsea', homeScore: 1, awayScore: 1, time: '45+2\'', status: 'live' },
    { id: '3', homeTeam: 'Man United', awayTeam: 'Tottenham', homeScore: 0, awayScore: 2, time: '89\'', status: 'live' }
  ];

  const trendingTopics = [
    { topic: 'Haaland Hat-trick', posts: 234, engagement: 95 },
    { topic: 'Arsenal vs City', posts: 189, engagement: 88 },
    { topic: 'Messi Transfer Rumors', posts: 156, engagement: 92 },
    { topic: 'Champions League Draw', posts: 134, engagement: 76 }
  ];

  const achievements = [
    { title: 'First Goal Prediction', description: 'Predicted your first goal correctly', progress: 100, icon: '⚽' },
    { title: 'Community Helper', description: 'Helped 10 community members', progress: 70, icon: '🤝' },
    { title: 'Analysis Expert', description: 'Posted 50 tactical analyses', progress: 45, icon: '📊' },
    { title: 'Top Predictor', description: 'Maintain 80% prediction accuracy', progress: 85, icon: '🎯' }
  ];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now().toString(),
        user: { name: 'Daniel', avatar: 'DA', points: 1250 },
        content: newPost,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        isLiked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="space-y-6">
      {/* API Test Component - Remove after testing */}
      <ApiTestComponent />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-xl p-8 text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Welcome back, Daniel! 🎉</h1>
          <p className="text-xl opacity-90 mb-6">Ready to dive into the world of football analytics?</p>
          <div className="flex justify-center gap-4">
            <Link to="/live-scores" className="btn-primary">View Live Matches</Link>
            <Link to="/analytics" className="btn-accent">Check Analytics</Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Scores */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="text-red-500" />
                Live Matches
              </h2>
              <div className="flex items-center gap-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">LIVE</span>
              </div>
            </div>
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <motion.div
                  key={match.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-lg p-4 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{match.homeTeam}</span>
                        <span className="text-2xl font-bold">{match.homeScore}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">{match.awayTeam}</span>
                        <span className="text-2xl font-bold">{match.awayScore}</span>
                      </div>
                    </div>
                    <div className="text-center ml-6">
                      <div className="text-sm text-accent-400 font-bold">{match.time}</div>
                      <div className="text-xs text-gray-400 mt-1">Premier League</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-bold mb-4">Share Your Thoughts</h3>
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's your take on today's matches?"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-accent-400 transition-colors">📊</button>
                  <button className="text-gray-400 hover:text-accent-400 transition-colors">📷</button>
                  <button className="text-gray-400 hover:text-accent-400 transition-colors">🎯</button>
                </div>
                <button 
                  onClick={handlePost}
                  className="btn-primary text-sm px-4 py-2"
                  disabled={!newPost.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>

          {/* Community Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:bg-white/15 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center font-bold">
                    {post.user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold">{post.user.name}</span>
                      <span className="text-xs text-accent-400">Level 12</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {Math.floor((Date.now() - post.timestamp.getTime()) / 60000)}m ago
                      </span>
                    </div>
                    <p className="text-gray-200 mb-4">{post.content}</p>
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors">
                        <MessageCircle size={16} />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-accent-400 transition-colors">
                        <Share size={16} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-accent-400" />
              Trending
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="p-3 glass rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{topic.topic}</h4>
                      <p className="text-sm text-gray-400">{topic.posts} posts</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-accent-400">{topic.engagement}%</div>
                      <div className="text-xs text-gray-400">engagement</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="text-accent-400" />
              Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ delay: index * 0.1, duration: 1 }}
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                    />
                  </div>
                  <div className="text-xs text-right text-gray-400">{achievement.progress}%</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="text-accent-400" />
              Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 glass rounded-lg">
                <div className="text-2xl font-bold text-accent-400">24</div>
                <div className="text-sm text-gray-400">Predictions</div>
              </div>
              <div className="text-center p-3 glass rounded-lg">
                <div className="text-2xl font-bold text-green-400">78%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center p-3 glass rounded-lg">
                <div className="text-2xl font-bold text-primary-400">156</div>
                <div className="text-sm text-gray-400">Posts</div>
              </div>
              <div className="text-center p-3 glass rounded-lg">
                <div className="text-2xl font-bold text-accent-400">1.2k</div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;