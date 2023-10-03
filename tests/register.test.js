const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const server = require("./../src/app");
let userAccessToken; // Store the user's access token for creating a product
let productId; // Store the product ID for future tests

describe("Register User Tests", () => {
  beforeEach(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    // await mongoose.connect(process.env.MONGODB_URI);
  });
  afterEach(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
  });
  // Test user registration
  describe("POST /register", () => {
    it("should register a user and get an access token", async () => {
      const registrationResponse = await request(server)
        .post("/auth/register")
        .send({
          username: "testuser1",
          password: "testpassword",
          role: "buyer",
        });

      expect(registrationResponse.status).toBe(201);
      expect(registrationResponse.body).toHaveProperty("user");
      expect(registrationResponse.header).toHaveProperty("x-auth-token");
      userAccessToken = registrationResponse.headers["x-auth-token"];
    });

    it("should return 400 status if the username already exists", async () => {
      await request(server).post("/auth/register").send({
        username: "testuser1",
        password: "testpassword",
        role: "buyer",
      });

      const registrationResponse = await request(server)
        .post("/auth/register")
        .send({
          username: "testuser1",
          password: "testpassword",
          role: "buyer",
        });

      expect(registrationResponse.status).toBe(400);
    });

    it("should return password error", async () => {
      const registrationResponse = await request(server)
        .post("/auth/register")
        .send({
          username: "testuser2",
          password: "",
          role: "buyer",
        });

      expect(registrationResponse.status).toBe(400);
      expect(registrationResponse.error).toHaveProperty("message");
    });
  });
});
