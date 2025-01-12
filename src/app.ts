import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/router/routes";
import bodyParser from "body-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";

const app: Application = express();

// App Middlewares section Started
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(ExpressMongoSanitize());
app.use(helmet());
app.use(hpp());

//Routes section Started
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the Workspace");
});

app.use("/api", router);
// Error Handling Middlewares section Started

export default app;
