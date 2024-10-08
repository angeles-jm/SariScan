const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.post(
  "/create-stores",
  AuthMiddleware.authenticateUser,
  storeController.createStore
);

router.post(
  "/stores/products/:storeId",
  AuthMiddleware.authenticateUser,
  storeController.addProduct
);

router.get(
  "/get-stores",
  AuthMiddleware.authenticateUser,
  storeController.getStores
);

router.get(
  "/stores/products/:storeId",
  AuthMiddleware.authenticateUser,
  storeController.getStoreProducts
);

router.get(
  "/stores/product-barcode/:storeId",
  AuthMiddleware.authenticateUser,
  storeController.getProductByBarcode
);

module.exports = router;
