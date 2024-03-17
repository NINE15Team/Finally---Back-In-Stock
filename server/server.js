const express = require("express");
var cors = require('cors')
const { createRequestHandler } = require("@remix-run/express");

let app = express();

// Responses should be served with compression to minimize total network bytes.
// However, where this compression happens can vary wildly depending on your stack
// and infrastructure. Here we are compressing all our Express responses for the
// purpose of this starter repository, but feel free to (re)move it or change it.
app.use(cors());

app.use(express.static("public"));


app.get('/products/', function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for all origins!' })
})

app.all(
    "*",
    createRequestHandler({
        build: require("./build"),
    })
);

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server started on http://localhost:${port}`);
});