import { config } from "dotenv";
import express from 'express';
import morgan from 'morgan';
import appRouter from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
config();
const app = express();
// middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// remove in prod
app.use(morgan("dev"));
app.use("/api/v1", appRouter);
export default app;
//# sourceMappingURL=app.js.map