const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productsRoutes");

const PORT = 3000;
const MONGODB_URI = "mongodb://localhost:27017/SariScan";
const app = express();

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
