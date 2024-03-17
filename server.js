const remix = require("@remix-run/express");
const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors());

app.all(
    "*",
    remix.createRequestHandler({
        build: require("./build/server"),
    })
);
