const { PeerServer } = require('peer');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Configure PeerServer
const peerServer = PeerServer({
  port: process.env.PORT || 9000,
  path: '/sakhasampark',
  allow_discovery: true,
  proxied: true // Required for hosting platforms
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`PeerJS server running on port ${PORT}`);
});