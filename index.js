import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import notFound from "./src/middlewares/notFound.js";

dotenv.config();

import { errorMiddleware } from "./src/middlewares/error.js";
import db from "./src/config/db.js";

// Route Imports
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import orgRoutes from "./src/routes/orgRoutes.js";

// Instantiate a new express app and port
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Routes
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", orgRoutes);

// Middlewares
app.use(notFound);
app.use(errorMiddleware);

// Starts the server
const startServer = async () => {
  try {
    console.log("Authenticating database connection...");
    await db.authenticate();
    await db.sync();
    console.log(`DB Connected!`);
    app.listen(port, () =>
      console.log(`Server is Live! Running on PORT: ${port}`)
    );
  } catch (error) {
    console.log("Error starting server:", error.message);
    console.error(error);
    await db.close();
    // process.exit(1);
  }
};

startServer();

export default app;
