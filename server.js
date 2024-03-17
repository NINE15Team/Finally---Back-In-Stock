const remix = require("@remix-run/express");
const express = require("express");

const app = express();

app.all(
    "*",
    remix.createRequestHandler({
        build: require("./build/server"),
    })
);
