import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, MessageCircle, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="glass border-b border-white/20 p-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md mr-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search teams, players, matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 glass rounded-lg hover:bg-white/20 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 glass rounded-lg hover:bg-white/20 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs flex items-center justify-center">
                12
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 glass rounded-lg hover:bg-white/20 transition-colors"
            >
              <Settings size={18} />
            </motion.button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle size="md" className="mr-2" />

          {/* User Profile */}
          <div className="flex items-center gap-3 glass rounded-lg p-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">DA</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">Daniel</p>
              <p className="text-xs text-gray-400">Level 12</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;