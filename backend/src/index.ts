import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import promptRoutes from "./routes/promptRoutes";
import statsRoutes from "./routes/statsRoutes";
import { errorHandler } from "./middleware/validation";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    process.env.FRONTEND_URL
  ].filter(Boolean) as string[],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/prompts", promptRoutes);
app.use("/api/stats", statsRoutes);

// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

// Database configuration
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [path.join(__dirname, 'entity', '**', '*.{ts,js}')],
  migrations: [path.join(__dirname, 'migration', '**', '*.{ts,js}')],
  subscribers: [path.join(__dirname, 'subscriber', '**', '*.{ts,js}')],
});

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error));

export default app;