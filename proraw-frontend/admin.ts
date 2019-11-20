const express = require('express');
const app = express();
import { join } from 'path';

const DIST_FOLDER = join(process.cwd(), 'admin/admin');

app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: DIST_FOLDER });
});

export const adminApp = app;
