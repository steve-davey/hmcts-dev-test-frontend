import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {

  // Your existing route handler
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:4000/get-example-case');
      console.log('Example case data:', response.data);
      res.render('home', { example: response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', { example: {} });
    }
  });
}

