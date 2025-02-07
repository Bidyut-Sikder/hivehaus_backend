import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes/routes";
import bodyParser from "body-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/errors/globalErrorHandler";

const app: Application = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
app.use(globalErrorHandler)

export default app;
 