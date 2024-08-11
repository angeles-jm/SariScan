const StoreModel = require("../models/storeModel");
const UserModel = require("../models/userModel");

const ProductsModel = require("../models/productsModel");

exports.createStore = async (req, res) => {
  try {
    const { storeName } = req.body;
    const userId = req.user.id;

    const newStore = new StoreModel({
      storeName,
      owner: userId,
    });

    await newStore.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { store: newStore._id },
    });

    res
      .status(201)
      .json({ message: "Store created successfully", store: newStore });
  } catch (error) {
    console.error(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { storeId, productDetails } = req.body;

    console.log(storeId);

    const newProduct = new ProductsModel({
      ...productDetails,
    });

    await newProduct.save();

    // Add product to store
    await StoreModel.findByIdAndUpdate(storeId, {
      $push: { products: newProduct._id },
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An unexpected error occurred while adding the product",
        error: error.message,
      });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { storeId } = req.params;

    const storeProducts = await StoreModel.findById(storeId)
      .select("storeName")
      .populate("products");

    res.status(200).json({
      message: "Successfully retrieved your products!",
      products: storeProducts || "There is no product from your store!",
    });
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ message: "Error getting the products", error: error.message });
  }
};
