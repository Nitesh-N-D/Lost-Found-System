const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sanitizeBody = require("./utils/sanitize");
const {
  helmetMiddleware,
  apiLimiter,
  authLimiter,
} = require("./middleware/securityMiddleware");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const configuredProxyHops = Number(process.env.TRUST_PROXY_HOPS);
app.set(
  "trust proxy",
  Number.isInteger(configuredProxyHops) && configuredProxyHops >= 0
    ? configuredProxyHops
    : 1
);

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");

const allowedOrigins = [
  ...(process.env.CLIENT_URL ? [normalizeOrigin(process.env.CLIENT_URL)] : []),
  ...(process.env.CLIENT_URLS
    ? process.env.CLIENT_URLS.split(",").map(normalizeOrigin)
    : []),
  "http://localhost:5173",
  "https://lost-found-system.vercel.app",
]
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const error = new Error("CORS origin not allowed");
      error.statusCode = 403;
      callback(error);
    },
    credentials: true,
  })
);
app.use(helmetMiddleware);
app.use(apiLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(sanitizeBody);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Lost & Found API is running",
  });
});
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured before the server can start.");
  }

  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = (signal) => {
    server.close(async () => {
      try {
        await mongoose.disconnect();
      } catch (error) {
        console.error("MongoDB shutdown warning:", error.message);
      }
      console.log(`${signal}: HTTP server closed.`);
      process.exit(0);
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
};

start().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
