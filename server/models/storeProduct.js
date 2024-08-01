const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeProductSchema = new Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  price: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const StoreProductModel = mongoose.model("StoreProduct", storeProductSchema);

module.exports = StoreProductModel;
