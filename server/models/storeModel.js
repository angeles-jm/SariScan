const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeSchema = new Schema({
  storeName: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
});

const StoreModel = mongoose.model("Store", storeSchema);

module.exports = StoreModel;
