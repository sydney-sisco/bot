require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json());
var session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

const path = require('path');
const port = process.env.PORT || 3001
const APP_NAME = process.env.APP_NAME || 'webapp-template'

require('./features/passport')(app);

app.get('/api', (req, res) => {
  res.send('Hello World from API!')
})

app.get('/api/test', (req, res) => {
  const sampleData = {
    text: 'You are connected to the backend! ✅',
    randomData: Math.random(),
  };
  res.send(sampleData);
})

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
}));

// Serve your React app at the root path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), {
    etag: false,
    lastModified: false,
  });
});

const server = app.listen(port, () => {
  console.log(`${APP_NAME} listening on port ${port}`)
})

const io = require('./utils/socket')(server);
require('./features/socketPing')(io);
