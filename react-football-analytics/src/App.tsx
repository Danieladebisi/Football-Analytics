import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ApiStatusIndicator from './components/ApiStatusIndicator';
import ApiSetupGuide from './components/ApiSetupGuide';
import Dashboard from './pages/Dashboard';
import EnhancedDashboard from './pages/EnhancedDashboard';
import EnhancedLiveScores from './pages/EnhancedLiveScores';
import EnhancedAnalytics from './pages/EnhancedAnalytics';
import EnhancedPlayerRatings from './pages/EnhancedPlayerRatings';
import EnhancedStatistics from './pages/EnhancedStatistics';

function App() {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 light:from-gray-50 light:via-white light:to-gray-100 transition-colors duration-300">
          <ApiStatusIndicator />
          <Sidebar />
          <div className="lg:ml-64">
            <Header />
            <main className="p-6 min-h-screen">
              <AnimatePresence mode="wait">
                <Routes>
                    <Route
                      path="/"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <EnhancedDashboard />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Dashboard />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/live-scores"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <EnhancedLiveScores />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <EnhancedAnalytics />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/player-ratings"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <EnhancedPlayerRatings />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/statistics"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <EnhancedStatistics />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/api-setup"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <ApiSetupGuide />
                        </motion.div>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </main>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    );
  }

  export default App;