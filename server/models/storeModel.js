const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeSchema = new Schema({
  storeName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const StoreModel = mongoose.model("Store", storeSchema);

module.exports = StoreModel;
