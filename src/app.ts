import express = require("express");
const cors = require("cors");
import { Request, Response } from "express";
import dbConnection from "./DBService/database";
import { userRoutes } from "./utils/dependencies";
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/User", userRoutes.getRouter());

app.get("/health-check", (req: Request, res: Response) => {
	res.send("API Running");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

dbConnection();
