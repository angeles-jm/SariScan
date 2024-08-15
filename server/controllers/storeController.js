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
    const { storeId, products } = req.body;

    console.log(storeId);

    const newProduct = new ProductsModel({
      ...products,
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
    const productBarcode = req.query.productBarcode;

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
    ];

    if (productBarcode) {
      products.push({ $match: { "products.barcode": productBarcode } });
    }

    products = products.concat([
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
            $push: {
              products: "$products",
            },
          },
        },
      },
    ]);

    const result = await StoreModel.aggregate(products);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ message: "Error getting the products", error: error.message });
  }
};

// exports.getProductsByBarcode = async (req, res) => {
//   try {
//     const { storeId } = req.params;
//     const productBarcode = req.query.productBarcode;
//     const userId = req.user._id;

//     const user = await UserModel.findById(userId).populate("store").exec();

//     const isMatchWithUserStore = user.store
//       .map((checkStores) => checkStores.id)
//       .some((store) => store === storeId);

//     if (!isMatchWithUserStore)
//       return res.status(400).json({
//         message: "The store is not match with one of the user stores!",
//       });

//     const result = await StoreModel.aggregate([
//       {
//         $match: {
//           _id: mongoose.Types.ObjectId.createFromHexString(storeId),
//         },
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "products",
//           foreignField: "_id",
//           as: "products",
//         },
//       },
//       { $unwind: "$products" },
//       { $match: { "products.barcode": productBarcode } },
//       {
//         $project: {
//           "products.name": 1,
//           "products.barcode": 1,
//           "products.price": 1,
//           "products.imageUrl": 1,
//         },
//       },
//     ]);

//     res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Error fetching the product", error: error.message });
//   }
// };
