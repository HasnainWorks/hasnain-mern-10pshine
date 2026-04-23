require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Note = require("../models/Note");

const expect = chai.expect;
let requester;
let token;
let noteId;

before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  requester = chaiHttp.request.execute(app).keepOpen();

  // Create a test user and login to get token
  await requester.post("/api/auth/signup").send({
    name: "Notes Tester",
    email: "notestester@test.com",
    password: "123456"
  });

  const loginRes = await requester.post("/api/auth/login").send({
    email: "notestester@test.com",
    password: "123456"
  });

  token = loginRes.body.token;
});

after(async () => {
  try {
    await Note.deleteMany({});
    await User.deleteMany({ email: "notestester@test.com" });
    await mongoose.connection.close(); 
    requester.close();                 
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

describe("Notes Controller", () => {

  // TEST 1
  it("should create a new note", async () => {
    const res = await requester
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        content: "This is test content"
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("title", "Test Note");
    expect(res.body).to.have.property("content", "This is test content");
    noteId = res.body._id;
  });

  // TEST 2
  it("should get all notes for the user", async () => {
    const res = await requester
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
  });

  // TEST 3
  it("should update a note", async () => {
    const res = await requester
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Note",
        content: "Updated content"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("title", "Updated Note");
  });

  // TEST 4
  it("should delete a note", async () => {
    const res = await requester
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Note deleted");
  });

  // TEST 5
  it("should not access notes without token", async () => {
    const res = await requester.get("/api/notes");

    expect(res.status).to.equal(401);
  });
  // SERVICE LAYER - input validation
it("should not create a note with missing title", async () => {
  const res = await requester
    .post("/api/notes")
    .set("Authorization", `Bearer ${token}`)
    .send({ content: "No title here" });

  expect(res.status).to.equal(400);
});

// DATA ACCESS LAYER - invalid ID
it("should return 404 or error for invalid note ID", async () => {
  const res = await requester
    .put("/api/notes/000000000000000000000000")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Ghost", content: "Ghost" });

  expect(res.status).to.equal(404);
});

// DATA ACCESS LAYER - wrong user can't delete another's note
it("should not delete a note with wrong token", async () => {
  // First create a note
  const createRes = await requester
    .post("/api/notes")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Private Note", content: "Mine only" });

  const id = createRes.body._id;

  // Try deleting with a fake/wrong token
  const res = await requester
    .delete(`/api/notes/${id}`)
    .set("Authorization", "Bearer faketoken123");

  expect(res.status).to.equal(401);
});

});