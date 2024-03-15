const express = require('express');
const cors = require('cors');
const { createRequestHandler } = require('@remix-run/express');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Your Remix handlers here
// For example, serving your Remix assets and the catch-all handler for rendering
app.use(express.static('public'));

// This serves your Remix app
app.all(
    '*',
    createRequestHandler({
        getLoadContext() {
            // Whatever you want to pass to your loaders
        },
    })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
