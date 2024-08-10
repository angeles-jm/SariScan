const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router.get("/products", productsController.getProducts);

router.get("/products/:id", productsController.getProduct);

router.get(
  "/products/barcode/:barcode",
  productsController.getProductByBarcode
);

router.post("/products", productsController.createProducts);

module.exports = router;
