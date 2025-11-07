import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  Menu, 
  X,
  Users,
  Settings,
  Bell,
  Activity,
  Star,
  PieChart,
  Trophy,
  Key
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Enhanced Dashboard', href: '/', icon: Home },
    { name: 'Live Scores', href: '/live-scores', icon: Activity },
    { name: 'Advanced Analytics', href: '/analytics', icon: PieChart },
    { name: 'Player Ratings', href: '/player-ratings', icon: Star },
    { name: 'Statistics', href: '/statistics', icon: TrendingUp },
    { name: 'API Setup', href: '/api-setup', icon: Key },
    { name: 'Basic Dashboard', href: '/dashboard', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 glass rounded-lg p-2 text-white bg-primary-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 w-64 h-full 
          bg-white/95 dark:bg-slate-900/95 backdrop-blur-md 
          border-r border-gray-200 dark:border-white/20 
          transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1">
              <img 
                src="/logo.png" 
                alt="Fans Talk 90 Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to Trophy icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  const fallbackIcon = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallbackIcon) {
                    fallbackIcon.style.display = 'flex';
                  }
                }}
              />
              <Trophy className="w-8 h-8 text-accent-400 hidden" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Fans Talk 90</h1>
              <p className="text-sm text-gray-400">Football Analytics</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`nav-link flex items-center gap-3 w-full ${
                        isActive ? 'active' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-white/20 pt-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-slate-900">DA</span>
              </div>
              <div>
                <p className="font-medium">Daniel</p>
                <p className="text-sm text-gray-400">1,250 pts</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button className="nav-link flex items-center gap-3 w-full">
                <Users size={18} />
                <span>Community</span>
              </button>
              <button className="nav-link flex items-center gap-3 w-full">
                <Bell size={18} />
                <span>Notifications</span>
              </button>
              <button className="nav-link flex items-center gap-3 w-full">
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;