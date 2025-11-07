import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, CheckCircle, Copy, ExternalLink, AlertCircle, BookOpen } from 'lucide-react';

const ApiSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const steps = [
    {
      title: 'Choose Your API',
      description: 'Select the best API option for your needs',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800 dark:text-green-200">Free Option (Current)</h4>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm mb-2">
              Using TheSportsDB - No setup required!
            </p>
            <ul className="text-green-600 dark:text-green-400 text-xs space-y-1">
              <li>✅ No registration needed</li>
              <li>✅ Basic Premier League data</li>
              <li>❌ Limited real-time updates</li>
              <li>❌ Fewer features</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Premium Option</h4>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
              API-Football (RapidAPI) - Enhanced features
            </p>
            <ul className="text-blue-600 dark:text-blue-400 text-xs space-y-1">
              <li>✅ Real-time live scores</li>
              <li>✅ Comprehensive statistics</li>
              <li>✅ Multiple leagues</li>
              <li>✅ Player details</li>
            </ul>
            <a
              href="https://rapidapi.com/api-sports/api/api-football"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
            >
              Get Free API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      title: 'Get Your API Key',
      description: 'Register and obtain your API key',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">API-Football Setup</h4>
            </div>
            
            <ol className="text-yellow-700 dark:text-yellow-300 text-sm space-y-3 list-decimal list-inside">
              <li>
                <a 
                  href="https://rapidapi.com/api-sports/api/api-football" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  Visit API-Football on RapidAPI
                </a>
              </li>
              <li>Click "Subscribe to Test" button</li>
              <li>Choose the <strong>Basic plan (FREE)</strong> - 100 requests/day</li>
              <li>Create a RapidAPI account if needed</li>
              <li>Copy your <strong>X-RapidAPI-Key</strong> from the dashboard</li>
            </ol>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Your API Key will look like:</h5>
            <div className="bg-white dark:bg-gray-900 border rounded p-3 font-mono text-sm text-gray-600 dark:text-gray-400">
              1234567890abcdef1234567890abcdef
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Configure Environment',
      description: 'Set up your local environment file',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
              Create Environment File
            </h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                  1. Create a file named <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">.env.local</code> in your project root
                </p>
              </div>

              <div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                  2. Add your API key:
                </p>
                <div className="bg-white dark:bg-gray-900 border rounded p-3 relative">
                  <code className="text-sm text-gray-700 dark:text-gray-300">
                    REACT_APP_API_FOOTBALL_KEY=your_api_key_here
                  </code>
                  <button
                    onClick={() => copyToClipboard('REACT_APP_API_FOOTBALL_KEY=your_api_key_here', 'env')}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {copied === 'env' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                  3. Replace <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">your_api_key_here</code> with your actual API key
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <h5 className="font-medium text-red-800 dark:text-red-200">Important Notes</h5>
            </div>
            <ul className="text-red-700 dark:text-red-300 text-sm space-y-1 list-disc list-inside">
              <li>Never commit your <code>.env.local</code> file to version control</li>
              <li>Restart your development server after adding the API key</li>
              <li>Keep your API key secure and don't share it publicly</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Test & Verify',
      description: 'Restart and verify your API connection',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
              Final Steps
            </h4>
            
            <ol className="text-green-700 dark:text-green-300 text-sm space-y-2 list-decimal list-inside">
              <li>Save your <code>.env.local</code> file</li>
              <li>Stop your development server (Ctrl+C)</li>
              <li>Restart with <code>npm start</code></li>
              <li>Check the API status indicator in the top-right corner</li>
              <li>It should show "Premium API" with a green checkmark</li>
            </ol>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Troubleshooting</h5>
            <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
              <p><strong>Still seeing "Free API"?</strong> Double-check your .env.local file location and syntax</p>
              <p><strong>"Invalid API key" error?</strong> Verify your API key is correct and has no extra spaces</p>
              <p><strong>"Rate limit exceeded"?</strong> You've hit the free tier limit, wait or upgrade your plan</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                API Setup Guide
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Upgrade to real-time football data in 4 easy steps
              </p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Step Navigation */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeStep === index
                      ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      activeStep === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className={`font-medium ${
                        activeStep === index
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${
                        activeStep === index
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 p-6">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {steps[activeStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {steps[activeStep].description}
              </p>
              
              {steps[activeStep].content}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Previous
                </button>
                
                <button
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  disabled={activeStep === steps.length - 1}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeStep === steps.length - 1 ? 'Complete' : 'Next →'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiSetupGuide;