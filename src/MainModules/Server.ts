// HTTP SERVER
import os from "os";
import formData from "express-form-data";
import express from "express";
import session from "express-session";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { createServer } from "http";
import debug from "debug";
import cors from "cors";
import { join } from "path";

// Config
import { Config } from "../Constants";
import { Session, Socket, RoutesEpicMiddleware } from "../MainModules";
import { ServerUtil } from "../Utils";

const {
  Server: { Port, SocketIoPort, corsDomain, MainDomain, SESSION_TOKEN }
} = Config;

const app = express();
const Server = createServer(app);
const serverPort = ServerUtil.normalizePort(app.get("port") || Port);
const debugServer = debug("goz-site:server");

// ==========================================
// tools
// ==========================================
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  formData.parse({
    uploadDir: os.tmpdir(),
    // autoClean: true
  })
);
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());
// ==========================================
app.use(
  session({
    secret: SESSION_TOKEN,
    cookie: {
      path: "/",
      domain: MainDomain,
      maxAge: 1000 * 60 * 24 // 24 hours
    },
    resave: true,
    saveUninitialized: true
  })
);

// ===========================================
// SESSION CROSS - KEEPING ACCESS CONTROL ON
// ===========================================
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", String(req.headers.origin));
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    );
    next();
  }
);

const setPort = () => app.set("port", serverPort);

const listen = (): void => {
  app.listen(serverPort, () => {
    console.log(
      `The server is running and listening at http://localhost:${serverPort}`
    );
  });
  Server.listen(SocketIoPort, () => {
    console.log(
      `The Socket is running and listening at http://localhost:${SocketIoPort}`
    );
  });
};

app.use(
  cors({
    origin: corsDomain, // Must be switched for production
    optionsSuccessStatus: 200
  })
);

Session.initSessionHeaders();
Socket.initSocket({ Server });

RoutesEpicMiddleware(app);

// Endpoint to check if the API is running
app.get("/status", (req: express.Request, res: express.Response) => {
  res.send({ status: "ok" });
});
app.get(
  "/json",
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {}
);
app.get(
  "/json/version",
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {}
);

app.use("/Images", express.static(join(process.cwd(), "public/Images")));

// ON ERROR
Server.on("error", ServerUtil.onError(serverPort));
// ON LISTENING
Server.on("listening", ServerUtil.onListening(Server, debugServer));

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
});

// catch 404 and forward to error handler
app.use(
  (err: any, res: express.Response, next: express.NextFunction): void => {
    next({ ...new Error("Not Found"), status: 404 });
  }
);

// error handler
app.use(
  (err: any, req: express.Request, res: express.Response): void => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  }
);

export default {
  getApp: (): express.Application => app,
  setPort,
  listen
};
