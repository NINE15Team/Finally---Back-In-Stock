// import the app build created by `remix build`
import build from "./build/index.js";

// an express http server
const app = express();

// and here your Remix app is "just a request handler"
app.all("*", createRequestHandler({ build }));

app.get('/products/', cors(), function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for an allowed domain.' })
});

app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})
// This is pseudo code, but illustrates what adapters do:
export function createRequestHandler({ build }) {
    console.log("%%%%%%%%%%%", build);
    // returns an express.js specific handler for the express server
    return async (req, res) => {
        console.log(req);
        // adapts the express.req to a Fetch API request
        return req;
    };
}
