const request = require("supertest");
const app = require("./../src/app"); // Import your Express app
const { User } = require("./../src/models/userModel"); // Import your User model
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Sample user data for testing
const sampleUserData = {
  username: "testuser",
  password: "password123",
  role: "buyer",
};

describe("Product Tests", () => {
  let token = "";
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    const hashedPassword = await bcrypt.hash(sampleUserData.password, 10);
    await User.create({
      username: sampleUserData.username,
      password: hashedPassword,
      role: sampleUserData.role,
    });

    const responseAuth = await request(app).post("/auth/login").send({
      username: sampleUserData.username,
      password: sampleUserData.password,
    });

    token = responseAuth.body.token;
  });

  describe("POST /products with invalid credentials", () => {
    it("should create a new product", async () => {
      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          productName: "product1",
          cost: 100,
          availableAmount: 10,
        });

      expect(response.status).toBe(201);
    });

    it("should return 400 if the product name is empty", async () => {
      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          productName: "",
          cost: 100,
          availableAmount: 10,
        });

      expect(response.status).toBe(400);
    });
  });

  // Clean up after tests
  afterAll(async () => {
    await User.deleteMany({}); // Remove test user data from the database
    await mongoose.connection.close();
    await mongoose.disconnect();
  });
});
// Create a user with hashed password for testing
