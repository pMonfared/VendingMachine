const request = require("supertest");
const app = require("./../src/app");

const { User } = require("./../src/models/userModel"); // Import your User model
const { Product } = require("./../src/models/productModel"); // Import your Product model
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Sample user data for testing
const sampleBuyerUserData = {
  username: "buyerTest",
  password: "password123",
  role: "buyer",
};

const sampleSellerUserData = {
  username: "sellerTest",
  password: "password123",
  role: "seller",
};

describe("Buy Product Tests", () => {
  let sellerUserToken = "";
  let buyerUserToken = "";
  let product = null;
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    const hashedPasswordBuyer = await bcrypt.hash(
      sampleBuyerUserData.password,
      10
    );
    const hashedPasswordSeller = await bcrypt.hash(
      sampleSellerUserData.password,
      10
    );
    await User.create({
      username: sampleBuyerUserData.username,
      password: hashedPasswordBuyer,
      role: sampleBuyerUserData.role,
      deposit: 100,
    });

    const userSeller = await User.create({
      username: sampleSellerUserData.username,
      password: hashedPasswordSeller,
      role: sampleSellerUserData.role,
      deposit: 0,
    });

    product = await Product.create({
      amountAvailable: 10,
      cost: 10,
      productName: "Test Product",
      sellerId: userSeller._id,
    });

    const responseAuthBuyer = await request(app).post("/auth/login").send({
      username: sampleBuyerUserData.username,
      password: sampleBuyerUserData.password,
    });

    buyerUserToken = responseAuthBuyer.body.token;
  });

  it("should buy the specified product", async () => {
    // Buy the product
    const response = await request(app)
      .post(`/products/${product._id}/buy`)
      .set("Authorization", `Bearer ${buyerUserToken}`)
      .send({ quantity: 1 })
      .expect(200);

    expect(response.body.productPurchased.productId).toBe(
      product._id.toString()
    );
    expect(response.body.productPurchased.productName).toBe("Test Product");
    expect(response.body.productPurchased.amountAvailable).toBe(9);
    expect(response.body.productPurchased.quantity).toBe(1);
  });

  it("should throw an error if the user does not have enough balance to purchase the product", async () => {
    // Try to buy the product with insufficient balance
    const response = await request(app)
      .post(`/products/${product._id}/buy`)
      .set("Authorization", `Bearer ${buyerUserToken}`)
      .send({ quantity: 11 })
      .expect(400);

    expect(response.body.message).toBe("Insufficient funds");
  });

  it("should throw an error if the product is out of stock", async () => {
    // Try to buy the product
    await request(app)
      .post(`/products/${product._id}/buy`)
      .set("Authorization", `Bearer ${buyerUserToken}`)
      .send({ quantity: 9 })
      .expect(200);

    const response2 = await request(app)
      .post(`/products/${product._id}/buy`)
      .set("Authorization", `Bearer ${buyerUserToken}`)
      .send({ quantity: 10 })
      .expect(400);

    expect(response2.body.message).toBe("Product is out of stock");
  });

  it("should throw an error if the product is not exist", async () => {
    // Try to buy the product
    const response = await request(app)
      .post(`/products/651c58bf6c76ce2039d28cf7/buy`)
      .set("Authorization", `Bearer ${buyerUserToken}`)
      .send({ quantity: 9 })
      .expect(404);

    expect(response.body.message).toBe("Product not found");
  });

  // Clean up after tests
  afterAll(async () => {
    await User.deleteMany({}); // Remove test user data from the database
    await Product.deleteMany({}); // Remove test producs data from the database
    await mongoose.connection.close();
    await mongoose.disconnect();
  });
});
