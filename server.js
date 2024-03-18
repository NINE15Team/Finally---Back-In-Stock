const remix = require("@remix-run/express");
const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors({credentials: true, origin: 'http://127.0.0.1:9292'}));
app.all(
    "*",
    remix.createRequestHandler({
        build: require("./build/server"),
    })
);
