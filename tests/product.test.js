const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const server = require("./../src/app");
let userAccessToken; // Store the user's access token for creating a product
let productId; // Store the product ID for future tests

describe("Product Tests", () => {
  let mongoServer;
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log("Mongo Db in Memory uri", mongoUri);
    await mongoose.connect(mongoUri);
    // await mongoose.connect(process.env.MONGODB_URI);
  });
  afterEach(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
  });
  // Test user registration
  describe("user register", () => {
    it("should register a user and get an access token", async () => {
      try {
        const registrationResponse = await request(server)
          .post("/auth/register")
          .send({
            username: "testuser3",
            password: "testpassword",
            role: "buyer",
          });

        expect(registrationResponse.status).toBe(201);
        expect(registrationResponse.body).toHaveProperty("_id");
        expect(registrationResponse.header).toHaveProperty("x-auth-token");
        userAccessToken = registrationResponse.headers["x-auth-token"];
      } catch (error) {
        console.log("error:", error);
      }
    });
  });
});