import axios from 'axios';
import { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app: Application): void {
  // Add the proxy middleware globally for all /api requests
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:4000', // Backend Spring Boot API server
    changeOrigin: true,
    pathRewrite: { '^/api' : '' } // remove /api prefix when forwarding
  }));

  // Your existing route handler
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:4000/api/get-example-case');
      console.log('Example case data:', response.data);
      res.render('home', { example: response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', { example: {} });
    }
  });
}

