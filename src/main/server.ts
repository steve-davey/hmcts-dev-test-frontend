#!/usr/bin/env node
import { app } from './app';

const port: number = parseInt(process.env.PORT || '3100', 10);

app.listen(port, () => {
  console.log(`Application started: http://localhost:${port}`);
});
