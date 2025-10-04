import express from "express";
import authRoutes from "./routes/authRoutes";
import expenseRoutes from "./routes/expenseRoutes";

const app = express();

app.use(express.json());

// health check
app.get("/", (_req, res) => res.send("Backend running successfully 🚀"));

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

console.log("✅ Routes loaded:");
console.log("   /api/auth ->", Object.keys(authRoutes));


export default app;
