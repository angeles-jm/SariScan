const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.post(
  "/stores",
  AuthMiddleware.authenticateUser,
  storeController.createStore
);

router.post(
  "/stores/products",
  AuthMiddleware.authenticateUser,
  storeController.addProduct
);

router.get(
  "/stores/products/:storeId",
  AuthMiddleware.authenticateUser,
  storeController.getProducts
);

module.exports = router;
