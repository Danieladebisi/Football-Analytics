import React from 'react';
import { useApiStatus } from '../hooks/useFootballData';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Key, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

const ApiStatusIndicator: React.FC = () => {
  const { isConnected, apiType, lastChecked, error, checkConnection } = useApiStatus();

  const getStatusColor = () => {
    if (!isConnected) return 'text-red-500';
    if (apiType === 'premium') return 'text-green-500';
    return 'text-yellow-500';
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="w-4 h-4" />;
    if (apiType === 'premium') return <CheckCircle className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isConnected) return 'API Disconnected';
    if (apiType === 'premium') return 'Premium API';
    return 'Free API';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
        {/* Status Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isConnected ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              className={getStatusColor()}
            >
              {getStatusIcon()}
            </motion.div>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          <button
            onClick={checkConnection}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Refresh Connection"
          >
            <RefreshCw className="w-3 h-3 text-gray-500" />
          </button>
        </div>

        {/* Status Details */}
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Data Source:</span>
                  <span className="font-medium">
                    {apiType === 'premium' ? 'API-Football' : 'TheSportsDB'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium">
                    {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Features:</span>
                  <span className="font-medium">
                    {apiType === 'premium' ? 'Full' : 'Limited'}
                  </span>
                </div>
              </div>

              {apiType === 'free' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mt-3">
                  <div className="flex items-start gap-2">
                    <Key className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        Using Free API
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 mb-2">
                        Limited features and slower updates. Upgrade for real-time data!
                      </p>
                      <a
                        href="https://rapidapi.com/api-sports/api/api-football"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-yellow-700 dark:text-yellow-300 hover:underline text-xs"
                      >
                        Get API Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                      Connection Failed
                    </p>
                    <p className="text-red-700 dark:text-red-300 text-xs">
                      {error || 'Unable to connect to football data API'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-1">Possible solutions:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Check your internet connection</li>
                  <li>Verify API key configuration</li>
                  <li>Try refreshing the page</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ApiStatusIndicator;