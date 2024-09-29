const StoreModel = require("../models/storeModel");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");
const ProductsModel = require("../models/productsModel");

// CREATING A STORE
exports.createStore = async (req, res) => {
  try {
    const { storeName } = req.body;
    const userId = req.user.id;

    // instance
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

// GETTING THE STORE
exports.getStores = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).populate("store").exec();

    const userStoreDetails = user.$getPopulatedDocs().map((stores) => ({
      storeId: stores._id,
      storeName: stores.storeName,
      // we get the username for the owner => will change to full name soon
      owner: user.username,
      products: `${
        stores.products.length > 0
          ? `You have ${stores.products.length} products`
          : "You dont have any products yet"
      }`,
    }));

    res.status(200).json(userStoreDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting store", error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { products } = req.body;
    const { storeId } = req.params;

    console.log("StoreId:", storeId);
    console.log("Product to add:", products);

    // Check if a product with this barcode already exists
    const existingProduct = await ProductsModel.findOne({
      barcode: products.barcode,
    });

    if (existingProduct) {
      // Check if this product is already in the store
      const storeWithProduct = await StoreModel.findOne({
        _id: storeId,
        products: existingProduct._id,
      });

      if (storeWithProduct) {
        return res.status(400).json({
          message: "A product with this barcode already exists in the store",
          existingProduct: existingProduct,
        });
      }
    }

    // If the product doesn't exist or isn't in this store, it will add the product
    let productToAdd = existingProduct;
    console.log(productToAdd);

    if (!productToAdd) {
      productToAdd = new ProductsModel({
        ...products,
      });

      await productToAdd.save();
    }

    // Add product to store
    const updatedStore = await StoreModel.findByIdAndUpdate(
      storeId,
      {
        $addToSet: { products: productToAdd._id },
      },
      { new: true }
    );

    console.log("Updated store:", updatedStore);

    res
      .status(201)
      .json({ message: "Product added successfully", product: productToAdd });
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({
      message: "An unexpected error occurred while adding the product",
      error: error.message,
    });
  }
};
exports.getStoreProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user._id;

    const user = await UserModel.findById(userId).populate("store").exec();

    const isMatchWithUserStore = user.store
      .map((checkStores) => checkStores.id)
      .some((store) => store === storeId);

    if (!isMatchWithUserStore)
      return res.status(400).json({
        message: "The store is not match with one of the user stores!",
      });

    let products = [
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(storeId),
        },
      },
      {
        $project: {
          owner: 1,
          storeName: 1,
          products: 1,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          storeName: 1,
          owner: 1,
          "products.name": 1,
          "products.barcode": 1,
          "products.price": 1,
          "products.imageUrl": 1,
          "products.date": 1,
        },
      },
      {
        $group: {
          _id: storeId,
          storeName: { $first: "$storeName" },
          owner: { $first: "$owner" },
          products: {
            $push: "$products",
          },
        },
      },
    ];

    const result = await StoreModel.aggregate(products);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting the products", error: error.message });
  }
};

exports.getProductByBarcode = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { productBarcode } = req.query;
    const userId = req.user._id;

    const user = await UserModel.findById(userId).populate("store").exec();

    const isMatchWithUserStore = user.store
      .map((checkStores) => checkStores.id)
      .some((store) => store === storeId);

    if (!isMatchWithUserStore)
      return res.status(400).json({
        message: "The store is not match with one of the user stores!",
      });

    let products = [
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(storeId),
        },
      },
      {
        $project: {
          owner: 1,
          storeName: 1,
          products: 1,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: { "products.barcode": productBarcode },
      },
      {
        $project: {
          storeName: 1,
          owner: 1,
          "products.name": 1,
          "products.barcode": 1,
          "products.price": 1,
          "products.imageUrl": 1,
          "products.date": 1,
        },
      },
    ];

    const result = await StoreModel.aggregate(products);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Product not found in this store." });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting the product", error: error.message });
  }
};
