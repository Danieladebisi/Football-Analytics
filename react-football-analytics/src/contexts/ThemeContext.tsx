import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to dark
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('football-analytics-theme');
    return (savedTheme as Theme) || 'dark';
  });

  // Update document class and localStorage when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('football-analytics-theme', theme);
    
    // Update CSS custom properties for theme
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-tertiary', '#64748b');
      root.style.setProperty('--border-primary', '#e2e8f0');
      root.style.setProperty('--border-secondary', '#cbd5e1');
      root.style.setProperty('--accent-primary', '#3b82f6');
      root.style.setProperty('--accent-secondary', '#10b981');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--card-border', '#e2e8f0');
      root.style.setProperty('--hover-bg', '#f1f5f9');
    } else {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-tertiary', '#334155');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--text-tertiary', '#94a3b8');
      root.style.setProperty('--border-primary', '#334155');
      root.style.setProperty('--border-secondary', '#475569');
      root.style.setProperty('--accent-primary', '#3b82f6');
      root.style.setProperty('--accent-secondary', '#10b981');
      root.style.setProperty('--card-bg', '#1e293b');
      root.style.setProperty('--card-border', '#334155');
      root.style.setProperty('--hover-bg', '#334155');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme-aware utility classes
export const themeClasses = {
  // Background classes
  bgPrimary: 'bg-white dark:bg-slate-900',
  bgSecondary: 'bg-gray-50 dark:bg-slate-800',
  bgTertiary: 'bg-gray-100 dark:bg-slate-700',
  
  // Text classes
  textPrimary: 'text-gray-900 dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-300',
  textTertiary: 'text-gray-500 dark:text-gray-400',
  
  // Border classes
  borderPrimary: 'border-gray-200 dark:border-slate-600',
  borderSecondary: 'border-gray-300 dark:border-slate-500',
  
  // Card classes
  card: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600',
  cardHover: 'hover:bg-gray-50 dark:hover:bg-slate-700',
  
  // Button classes
  button: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
  buttonSecondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500',
  
  // Input classes
  input: 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500 text-gray-900 dark:text-white',
  
  // Navigation classes
  nav: 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700',
  navLink: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
  navActive: 'text-blue-600 dark:text-blue-400'
};

// CSS variables for consistent theming
export const cssVariables = `
  :root {
    --transition-colors: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  }
  
  .theme-transition {
    transition: var(--transition-colors);
  }
  
  .theme-bg-primary {
    background-color: var(--bg-primary);
  }
  
  .theme-bg-secondary {
    background-color: var(--bg-secondary);
  }
  
  .theme-text-primary {
    color: var(--text-primary);
  }
  
  .theme-text-secondary {
    color: var(--text-secondary);
  }
  
  .theme-border {
    border-color: var(--border-primary);
  }
`;

export default ThemeContext;