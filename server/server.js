// server/server.js
const express = require('express');
const cors = require('cors');
const remix = require("@remix-run/express");

const app = express();

// Configure CORS for a specific domain
const corsOptions = {
    origin: '*',
};

// Serve the Remix app
app.all(
    "*",
    remix.createRequestHandler({
        build: require("./build/server"),
    })
);


app.get('/products', cors(), function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for an allowed domain.' })
})

app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})