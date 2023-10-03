const request = require("supertest");
const app = require("./../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("/deposit endpoint", () => {
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

  it("should deposit coins correctly", async () => {
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser1",
        password: "testpassword",
        role: "buyer",
      });

    expect(registrationResponse.status).toBe(201);
    expect(registrationResponse.body).toHaveProperty("user");
    expect(registrationResponse.header).toHaveProperty("x-auth-token");
    const token = registrationResponse.headers["x-auth-token"];

    const response = await request(app)
      .post("/users/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.deposit).toBe(5);
  });

  it("should throw an 403 if the user role is not 'buyer'", async () => {
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser1",
        password: "testpassword",
        role: "seller",
      });

    expect(registrationResponse.status).toBe(201);
    expect(registrationResponse.body).toHaveProperty("user");
    expect(registrationResponse.header).toHaveProperty("x-auth-token");
    const token = registrationResponse.headers["x-auth-token"];

    const response = await request(app)
      .post("/users/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 10,
      });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Permission denied");
  });

  it("should throw an 400 if the coin is not valid", async () => {
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser1",
        password: "testpassword",
        role: "buyer",
      });

    expect(registrationResponse.status).toBe(201);
    expect(registrationResponse.body).toHaveProperty("user");
    expect(registrationResponse.header).toHaveProperty("x-auth-token");
    const token = registrationResponse.headers["x-auth-token"];

    const response = await request(app)
      .post("/users/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 2,
      })
      .expect(400);

    expect(response.body.message).toBe(
      '"amount" must be one of [5, 10, 20, 50, 100]'
    );
  });

  it("should throw an 400 if the coins array is empty", async () => {
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser1",
        password: "testpassword",
        role: "buyer",
      });

    expect(registrationResponse.status).toBe(201);
    expect(registrationResponse.body).toHaveProperty("user");
    expect(registrationResponse.header).toHaveProperty("x-auth-token");
    const token = registrationResponse.headers["x-auth-token"];

    const response = await request(app)
      .post("/users/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 0,
      })
      .expect(400);

    expect(response.body.message).toBe(
      '"amount" must be one of [5, 10, 20, 50, 100]'
    );
  });

  it("should throw 400 if the coin is not in the accepted coins list", async () => {
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser1",
        password: "testpassword",
        role: "buyer",
      });

    expect(registrationResponse.status).toBe(201);
    expect(registrationResponse.body).toHaveProperty("user");
    expect(registrationResponse.header).toHaveProperty("x-auth-token");
    const token = registrationResponse.headers["x-auth-token"];

    const response = await request(app)
      .post("/users/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 3,
      })
      .expect(400);

    expect(response.body.message).toBe(
      '"amount" must be one of [5, 10, 20, 50, 100]'
    );
  });

  it("should throw 401 Unauthorized if the token is not set", async () => {
    const response = await request(app)
      .post("/users/deposit")
      .send({
        amount: 2,
      })
      .expect(401);

    expect(response.body.message).toBe("Unauthorized");
  });
});

describe("/deposit/reset endpoint", () => {
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
  it("should reset the user's balance to 0", async () => {
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser1",
        password: "testpassword",
        role: "buyer",
      });

    expect(registrationResponse.status).toBe(201);
    expect(registrationResponse.body).toHaveProperty("user");
    expect(registrationResponse.header).toHaveProperty("x-auth-token");
    const token = registrationResponse.headers["x-auth-token"];

    // Deposit some coins
    await request(app)
      .post("/users/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
      })
      .expect(200);

    // Reset the user's balance
    const resetResponse = await request(app)
      .post("/users/deposit/reset")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(resetResponse.body.deposit).toBe(0);
  });

  it("should throw an 403 if the user role is not 'buyer'", async () => {
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser1",
        password: "testpassword",
        role: "seller",
      });

    expect(registrationResponse.status).toBe(201);
    expect(registrationResponse.body).toHaveProperty("user");
    expect(registrationResponse.header).toHaveProperty("x-auth-token");
    const token = registrationResponse.headers["x-auth-token"];

    // Reset the user's balance
    const resetResponse = await request(app)
      .post("/users/deposit/reset")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    expect(resetResponse.body.message).toBe("Permission denied");
  });
});
