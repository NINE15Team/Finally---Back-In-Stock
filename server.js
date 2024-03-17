// import the app build created by `remix build`
import build from "./build/index.js";
import cors from "cors"

// an express http server
const app = express();

app.use(cors())

// and here your Remix app is "just a request handler"
app.all("*", createRequestHandler({ build }));

// This is pseudo code, but illustrates what adapters do:
export function createRequestHandler({ build }) {
    console.log(build)
    return async (req, res) => {
        console.log(req);
        return req;
    };
}
