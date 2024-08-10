const Products = require("../models/productsModel");

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find();

    res.json(products);

    if (!products) {
      return res.status(404).json({
        message: "Unable to get the products data",
        error: error.message,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Products not found", error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    console.log(`Your product is ${product.title}`);
    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Product does not exist", error: error.message });
  }
};

exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await Products.findOne({ barcode: req.params.barcode });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found. Create this product first!" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error checking the product.",
      error: error.message,
    });
  }
};

exports.createProducts = async (req, res) => {
  try {
    // Check if product already exist
    const isProductExist = await Products.findOne({
      barcode: req.body.barcode,
    });

    if (isProductExist)
      return res.status(400).json({
        message: "Barcode already exists in the system. Just update it.",
      });

    // Create new product if it doesn't exist
    const product = new Products(req.body);
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Product was not added in the list",
      error: error.message,
    });
  }
};
