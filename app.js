const express = require('express');
const app = express();

// Autoriser les requêtes CORS depuis le backend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(express.static("public"));

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

  module.exports = app;
