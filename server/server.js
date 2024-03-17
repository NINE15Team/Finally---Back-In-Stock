// server/server.js
const express = require('express');
const cors = require('cors');
const { createRequestHandler } = require('@remix-run/express');

const app = express();

// Configure CORS for a specific domain
const corsOptions = {
    origin: 'https://app-bis2.myshopify.com',
};

app.use(cors(corsOptions));

// Serve the Remix app
app.all('*', createRequestHandler(/* Remix handler config */));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
