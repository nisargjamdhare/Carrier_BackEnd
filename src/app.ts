import express from "express";
import routes from "./Routes/index";
import cors from "cors"; // Import cors

const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from your frontend URL
  methods: "GET,POST,PUT,DELETE", // Specify allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization" // Specify allowed headers
}));

// Middleware to parse JSON
app.use(express.json());

// Load routes
app.use("/User", routes);

export default app;
