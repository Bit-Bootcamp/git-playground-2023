import express from "express";
import morgan from "morgan";

import todoRoutes from "./routers/todoRoutes.js";
import rootRoutes from "./routers/rootRoutes.js";
// import rootController from "./controllers/rootControllers.js";
// const express = require("express");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// app.use((req, res, next) => {
//   if (req.headers.authentication === "hama") {
//     next();
//   }
//   res.status(401).json({ status: "error", message: "not authorized" });
// });

app.use("/api/todos", todoRoutes);
app.use("/api", rootRoutes);

// app.use("/", rootController);
export default app;
