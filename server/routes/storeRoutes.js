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
  "/stores/products",
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

// router.get(
//   "/stores/productbarcode/:storeId",
//   AuthMiddleware.authenticateUser,
//   storeController.getProductsByBarcode
// );

module.exports = router;
