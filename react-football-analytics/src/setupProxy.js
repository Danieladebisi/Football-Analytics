const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/football',
    createProxyMiddleware({
      target: 'https://api.football-data.org',
      changeOrigin: true,
      pathRewrite: {
        '^/api/football': '', // Remove /api/football from the path
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add the API key header
        proxyReq.setHeader('X-Auth-Token', '9658eb3b7e304dd1be0ac0ec6f9ee29e');
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error occurred' });
      }
    })
  );
};