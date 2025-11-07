import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative rounded-lg border-2 border-gray-200 dark:border-slate-600
        bg-white dark:bg-slate-800
        text-gray-600 dark:text-gray-300
        hover:bg-gray-50 dark:hover:bg-slate-700
        hover:border-gray-300 dark:hover:border-slate-500
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-slate-900
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : 180,
          scale: theme === 'light' ? 1 : 0.8
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        {theme === 'light' ? (
          <Sun className={`${iconSizes[size]} text-yellow-500`} />
        ) : (
          <Moon className={`${iconSizes[size]} text-blue-400`} />
        )}
      </motion.div>
      
      {/* Animated background indicator */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-purple-600 opacity-0 -z-10"
        animate={{
          opacity: theme === 'light' ? 0.1 : 0.1,
          scale: theme === 'light' ? 1 : 1.1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// Advanced theme toggle with text label
export const ThemeToggleWithLabel: React.FC<ThemeToggleProps & {
  showLabel?: boolean;
  labelPosition?: 'left' | 'right';
}> = ({ 
  className = '', 
  size = 'md',
  showLabel = true,
  labelPosition = 'right'
}) => {
  const { theme } = useTheme();

  const toggleComponent = <ThemeToggle size={size} className={className} />;
  const labelComponent = showLabel && (
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
      {theme} mode
    </span>
  );

  return (
    <div className={`flex items-center gap-3 ${labelPosition === 'left' ? 'flex-row-reverse' : ''}`}>
      {toggleComponent}
      {labelComponent}
    </div>
  );
};

// Theme toggle switch style
export const ThemeSwitch: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        bg-gray-200 dark:bg-slate-600
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-slate-900
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.span
        className={`
          inline-block h-4 w-4 transform rounded-full
          bg-white dark:bg-slate-200
          transition-transform duration-200 ease-in-out
          shadow-lg
        `}
        animate={{
          x: theme === 'light' ? 2 : 22
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <motion.div
          className="flex items-center justify-center h-full w-full"
          animate={{
            rotate: theme === 'light' ? 0 : 180
          }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? (
            <Sun className="w-2.5 h-2.5 text-yellow-500" />
          ) : (
            <Moon className="w-2.5 h-2.5 text-blue-500" />
          )}
        </motion.div>
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;