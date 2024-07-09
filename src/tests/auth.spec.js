import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../index.js";
import db from "../config/db.js";
import generateToken from "../config/generateToken.js";
import verifyToken from "../config/verifyToken.js";

const testUserId = "e0426d6f-79d7-4d7a-84ef-1934e26174ad";
const mockData = {
  username: "David007",
  firstName: "David",
  lastName: "Obodoakor",
  email: "david007@gmail.com",
  password: "12345",
  phone: "08182921833",
};

beforeAll(async () => {
  try {
    console.log("Syncing database...");
    await db.authenticate();
    console.log("Database synced and authenticated!");
  } catch (error) {
    console.log(error);
    await db.close();
    throw error;
  }
});

afterAll(async () => {
  try {
    console.log("Closing database connection...");
    // Close the database connection
    await db.close();
    console.log("Database connection closed!");
  } catch (error) {
    console.log("Error closing Database:", error);
  }
});

// e2e Testing
describe("POST /auth/register", () => {
  let accessToken;
  // Before running the test, synchronize the database

  it("It should register a user successfully", async () => {
    const response = await request(app).post("/auth/register").send(mockData);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.firstName).toBe(mockData.firstName);
    expect(response.body.data.user.lastName).toBe(mockData.lastName);
    expect(response.body.data.user.email).toBe(mockData.email);
    expect(response.body.data).toHaveProperty("accessToken");
    accessToken = response.body.data.accessToken;
  });

  it("It verify that an organisation was created upon user signup", async () => {
    const response = await request(app)
      .get("/api/organisations/")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("organisations");
    expect(response.body.organisations[0].name).toBe(
      `${mockData.firstName}'s Organisation`
    );
  });

  it("It should fail if firstName field is missing", async () => {
    const { firstName, ...dataWithoutFirstName } = mockData;

    const response = await request(app)
      .post("/auth/register")
      .send(dataWithoutFirstName);
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toHaveProperty("field");
    expect(response.body.errors[0]).toHaveProperty("message");
  });

  it("It should fail if lastName field is missing", async () => {
    const { lastName, ...dataWithoutlastName } = mockData;
    const response = await request(app)
      .post("/auth/register")
      .send(dataWithoutlastName);
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toHaveProperty("field");
    expect(response.body.errors[0]).toHaveProperty("message");
  });

  it("It should fail if email field is missing", async () => {
    const { email, ...dataWithoutEmail } = mockData;
    const response = await request(app)
      .post("/auth/register")
      .send(dataWithoutEmail);
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toHaveProperty("field");
    expect(response.body.errors[0]).toHaveProperty("message");
  });

  it("It should fail if password field is missing", async () => {
    const { password, ...dataWithoutPassword } = mockData;
    const response = await request(app)
      .post("/auth/register")
      .send(dataWithoutPassword);
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toHaveProperty("field");
    expect(response.body.errors[0]).toHaveProperty("message");
  });

  it("It should fail if email has been taken", async () => {
    const response = await request(app).post("/auth/register").send(mockData);
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toHaveProperty("field");
    expect(response.body.errors[0]).toHaveProperty("message");
  });
});

describe("POST /auth/login", () => {
  it("It should login a user successfully", async () => {
    const response = await request(app).post("/auth/login").send(mockData);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.firstName).toBe(mockData.firstName);
    expect(response.body.data.user.lastName).toBe(mockData.lastName);
    expect(response.body.data.user.email).toBe(mockData.email);
    expect(response.body.data).toHaveProperty("accessToken");
  });

  it("It should fail if wrong password is provided", async () => {
    const response = await request(app).post("/auth/login").send({
      email: mockData.email,
      password: "54321",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("Bad Request");
  });

  it("It should fail if password field is missing", async () => {
    const response = await request(app).post("/auth/login").send({
      email: mockData.email,
    });
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toHaveProperty("field");
    expect(response.body.errors[0]).toHaveProperty("message");
  });

  it("It should fail if email is missing", async () => {
    const response = await request(app).post("/auth/login").send({
      password: "54321",
    });
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toHaveProperty("field");
    expect(response.body.errors[0]).toHaveProperty("message");
  });
});

// Organisation Control
describe("Organisation Access Control", () => {
  let accessToken;
  let orgId;
  beforeAll(async () => {
    const response = await request(app).post("/auth/login").send(mockData);
    accessToken = response.body.data.accessToken;

    const orgResponse = await request(app)
      .get("/api/organisations/")
      .set("Authorization", `Bearer ${accessToken}`);
    orgId = orgResponse.body.organisations[0].orgId;
  });

  afterAll(async () => {
    await db.close();
  });

  it("should allow access to organization data for authorized user", async () => {
    // Make a request to get organization data
    const response = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("organisations");
  });

  it("should allow access to single organization data for authorized user", async () => {
    // Make a request to get organization data
    const response = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("orgId");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("description");
  });

  it("should deny access to organization data for unauthorized user", async () => {
    const response = await request(app).get("/api/organisations");
    expect(response.statusCode).toBe(401);
    expect(response.body.statusCode).toBe(401);
  });

  it("should deny access to single organization data for unauthorized user", async () => {
    const response = await request(app).get(`/api/organisations/${orgId}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.statusCode).toBe(401);
  });
});

// Unit Testing
// // Token Generation and User Details
describe("Token generation and verification", () => {
  it("It should have user information in generated token", async () => {
    const token = generateToken({ userId: testUserId, ...mockData });
    const decoded = verifyToken(token);

    // Verify user details in the decoded token
    expect(decoded.userId).toBe(testUserId);
    expect(decoded.username).toBe(mockData.username);
    expect(decoded.firstName).toBe(mockData.firstName);
    expect(decoded.lastName).toBe(mockData.lastName);
    expect(decoded.email).toBe(mockData.email);
  });

  it("Token should have correct expiration time", async () => {
    const token = generateToken({ userId: testUserId, ...mockData });
    const decoded = verifyToken(token);

    // Check if token has an expiration time
    const currentTime = Math.floor(Date.now() / 1000);
    expect(decoded.exp).toBeGreaterThan(currentTime);

    // Check if token expires in about 1 hour 
    const oneHourInSeconds = 3600;
    expect(decoded.exp - decoded.iat).toBeLessThanOrEqual(oneHourInSeconds);
  });
});
