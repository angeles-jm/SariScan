const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  barcode: { type: String, required: true },
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  source: {
    type: String,
    enum: ["local_db", "api", "user_contributed"],
    default: "local_db",
  },

  date: { type: Date, default: Date.now },
});

const ProductsModel = mongoose.model("Products", productSchema);

module.exports = ProductsModel;
