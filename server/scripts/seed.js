const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const UserModel = require("../models/userModel");
const ProductsModel = require("../models/productsModel");
const StoreModel = require("../models/storeModel");

const MONGODB_URI = "mongodb://localhost:27017/SariScan";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoDB");
  })
  .on("error", (error) => {
    console.error("Connection error:", error);
  });

// Seed Users
const seedUsers = async () => {
  for (let i = 0; i < 5; i++) {
    const user = new UserModel({
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
    });

    await user.save();
  }
  console.log("Users seeded");
};

// Seed Stores with Existing Products
const seedStores = async () => {
  const users = await UserModel.find();
  const products = await ProductsModel.find();

  console.log("Users found:", users.length); // Log the number of users found
  console.log("Products found:", products.length); // Log the number of products found

  for (let i = 0; i < 3; i++) {
    const selectedProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((product) => product._id);

    console.log("Selected products for store:", selectedProducts);

    const store = new StoreModel({
      storeName: faker.company.buzzNoun(),
      owner: users[Math.floor(Math.random() * users.length)]._id,
      products: selectedProducts,
    });

    await store.save();
    console.log(`Store ${store.storeName} saved with ID: ${store._id}`);
  }
  console.log("Stores seeded");
};

const seedDB = async () => {
  await UserModel.deleteMany({});
  await StoreModel.deleteMany({});

  await seedUsers();
  await seedStores();
  mongoose.connection.close();
};

seedDB();
