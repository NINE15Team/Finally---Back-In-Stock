var cors = require('cors')

const {
    createRequestHandler,
} = require("@remix-run/express");
const express = require("express");

const app = express();
const corsMiddleware = cors();

app.all(
    "*",
    createRequestHandler({
        // `remix build` and `remix dev` output files to a build directory, you need
        // to pass that build to the request handler
        build: require("./build"),

        // return anything you want here to be available as `context` in your
        // loaders and actions. This is where you can bridge the gap between Remix
        // and your server
        getLoadContext(req: any, res: any) {
            return {};
        },
    })
);
app.use(cors())
