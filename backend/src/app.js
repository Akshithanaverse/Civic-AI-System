import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(errorMiddleware);

export default app;
