require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

const expect = chai.expect;
let requester;

// Connect to DB and open server before tests
before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  requester = chaiHttp.request.execute(app).keepOpen();
});

// Clean up and close after all tests
after(async () => {
  await User.deleteMany({ email: "testuser@test.com" });
  await mongoose.connection.close();
  requester.close();
});

describe("Auth Controller", () => {

  // TEST 1
  it("should register a new user", async () => {
    const res = await requester
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "123456"
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("email", "testuser@test.com");
  });

  // TEST 2
  it("should not register with duplicate email", async () => {
    const res = await requester
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "123456"
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "User already exists");
  });

  // TEST 3
  it("should login with correct credentials", async () => {
    const res = await requester
      .post("/api/auth/login")
      .send({
        email: "testuser@test.com",
        password: "123456"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("user");
  });

  // TEST 4
  it("should not login with wrong password", async () => {
    const res = await requester
      .post("/api/auth/login")
      .send({
        email: "testuser@test.com",
        password: "wrongpassword"
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid email or password");
  });

  // TEST 5
  it("should not login with missing fields", async () => {
    const res = await requester
      .post("/api/auth/login")
      .send({
        email: "testuser@test.com"
      });

    expect(res.status).to.equal(400);
  });
  // SERVICE LAYER - missing field validations
it("should not register with missing name", async () => {
  const res = await requester
    .post("/api/auth/signup")
    .send({ email: "noname@test.com", password: "123456" });

  expect(res.status).to.equal(400);
});

it("should not register with missing password", async () => {
  const res = await requester
    .post("/api/auth/signup")
    .send({ name: "Test", email: "nopass@test.com" });

  expect(res.status).to.equal(400);
});

it("should not login with non-existent email", async () => {
  const res = await requester
    .post("/api/auth/login")
    .send({ email: "ghost@test.com", password: "123456" });

  expect(res.status).to.equal(400);
  expect(res.body).to.have.property("message");
});

});