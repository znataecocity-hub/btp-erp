require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL // الرابط الذي ستحصل عليه من Netlify
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Basic Route
app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "BTP ERP API is running perfectly." });
});

// We will add specific modular routes here later
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/hr", require("./routes/hr"));
app.use("/api/equipment", require("./routes/equipment"));
app.use("/api/reports", require("./routes/reports"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
