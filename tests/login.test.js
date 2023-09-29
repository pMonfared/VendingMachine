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

describe("Login user Tests", () => {
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
  });

  // Test login with valid credentials
  describe("POST /login with valid credentials", () => {
    it("should return a valid JWT token", async () => {
      const response1 = await request(app).post("/auth/login").send({
        username: sampleUserData.username,
        password: sampleUserData.password,
      });

      expect(response1.status).toBe(200);
      expect(response1.body).toHaveProperty("token");
    });
  });

  // Test login with invalid credentials
  describe("POST /login with invalid credentials", () => {
    it("should return a 401 status code (password)", async () => {
      const response2 = await request(app).post("/auth/login").send({
        username: sampleUserData.username,
        password: "incorrect_password",
      });

      expect(response2.status).toBe(401);
    });

    it("should return a 401 status code (username)", async () => {
      const response2 = await request(app).post("/auth/login").send({
        username: "incorrect_username",
        password: "incorrect_password",
      });

      expect(response2.status).toBe(401);
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
