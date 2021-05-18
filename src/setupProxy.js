const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://10.7.254.254:8080',
      changeOrigin: true,
    })
  );
};
