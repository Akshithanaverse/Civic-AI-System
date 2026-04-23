import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import nlpRoutes from "./routes/nlp.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/nlp", nlpRoutes);

app.use(errorMiddleware);

export default app;
