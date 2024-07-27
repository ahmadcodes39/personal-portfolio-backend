import express from "express";
import router from "./routes/Contact.js";
import dotenv from "dotenv";
import connectToMongo from "./db.js";
import cors from "cors";

dotenv.config();
connectToMongo();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials:true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api", router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is started at port ${port}`);
});
