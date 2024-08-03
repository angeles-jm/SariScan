const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productsRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const { MONGODB_URI, PORT } = process.env;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting", error.message);
  });

app.use("/api", productRoutes);
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
