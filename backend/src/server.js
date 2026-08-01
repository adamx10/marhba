import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import logger from "./middlewares/logger.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1010;

app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");

    await sequelize.sync();
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();