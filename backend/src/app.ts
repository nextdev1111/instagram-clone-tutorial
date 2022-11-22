// packages
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import errorResponder from "./middlewares/errorResponder";

// instance of express
const app = express();

// middlewares
app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(cookieParser());

// middewares routers
app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.use(errorResponder);

export default app;
