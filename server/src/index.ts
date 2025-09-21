import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import errorHandler from "./middlewares/errorHandler";

const app: Express = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (_req: any, res: { send: (arg0: string) => void }) => {
  res.send("<h1>Welcome to CustomTee Platform");
});

const port = process.env.PORT || 4301;
console.log(`App running on port ${port}`);
app.use(errorHandler);
app.listen(port);
