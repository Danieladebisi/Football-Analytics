import React, { useState } from 'react';
import { footballApi } from '../services/footballApi';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const ApiTestComponent: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Starting API connection test...');
      
      // Test basic connectivity first
      console.log('🔍 Environment check:');
      console.log('- API-Football Key present:', !!process.env.REACT_APP_API_FOOTBALL_KEY);
      console.log('- Football-Data Key present:', !!process.env.REACT_APP_FOOTBALL_DATA_KEY);
      
      const result = await footballApi.testApiConnection();
      if (result.success) {
        setTestResult({
          success: true,
          message: `✅ API connection successful! Real football data available.`,
          data: result.data,
        });
      } else {
        setTestResult({
          success: false,
          message: `❌ ${result.error}`,
        });
      }
    } catch (error) {
      console.error('🚨 Test failed:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">🔧 API Connection Test</h3>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test API Connection'
          )}
        </button>

        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              testResult.success
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{testResult.message}</span>
            </div>
            
            {testResult.success && testResult.data && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm opacity-80 hover:opacity-100">
                  View API Response
                </summary>
                <pre className="mt-2 text-xs bg-black/20 p-3 rounded overflow-auto max-h-40">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </details>
            )}
          </motion.div>
        )}

        {!process.env.REACT_APP_API_FOOTBALL_KEY && !process.env.REACT_APP_FOOTBALL_DATA_KEY && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              ℹ️ <strong>Using Free API:</strong> Using TheSportsDB for basic football data. For enhanced features, add an API key in the <code>.env.local</code> file. Check the API Setup guide for instructions.
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-400">
          <p className="mb-1"><strong>Free API:</strong> TheSportsDB (no setup required)</p>
          <p><strong>Premium API:</strong> API-Football (requires RapidAPI key)</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTestComponent;