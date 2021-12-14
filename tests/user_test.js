import { bcrypt, superoak } from "../deps.js";
import { app } from "../app.js";
import * as userService from "../services/userService.js";
import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";

Deno.test({
  name: "GET request to /questions should redirect to auth/login",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/questions").expect(302);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "Post request to /auth/register with too short password should not add a user",
  async fn() {
    await userService.deleteByEmail("test@test.test");
    const testClient = await superoak(app);
    await testClient.post("/auth/register").send({
      email: "test@test.test",
      password: 24,
    });
    const query = await userService.findUserByEmail("test@test.test");
    assertEquals(query.length, 0);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name:
    "Post request to /auth/register with wrong type of email should not add a user",
  async fn() {
    await userService.deleteByEmail("test.test");
    const testClient = await superoak(app);
    await testClient.post("/auth/register").send({
      email: "test@test.test",
      password: 24,
    });
    const query = await userService.findUserByEmail("test.test");
    assertEquals(query.length, 0);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Post request to /auth/register with correct data should add a user",
  async fn() {
    await userService.deleteByEmail("test@test.test");
    const testClient = await superoak(app);
    await testClient.post("/auth/register").send(
      "email=test@test.test&password=11111",
    ).expect(
      302,
    );
    const query = await userService.findUserByEmail("test@test.test");
    console.log(query);
    assertEquals(query.length, 1);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Password should be hashed",
  async fn() {
    const query = await userService.findUserByEmail("test@test.test");
    const compare = await bcrypt.compare("11111", query[0].password);
    assertEquals(compare, true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "User should be forbitten to go to quiz without login and redirected",
  async fn() {
    await userService.deleteByEmail("test@test.test");
    const testClient = await superoak(app);
    await testClient.get("/quiz").expect(
      302,
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "User should be able to login with correct credentials",
  async fn() {
    await userService.deleteByEmail("test@test.test");
    const testClient = await superoak(app);
    await testClient.post("/auth/login").send(
      "email=test@test.test&password=11111",
    ).expect(
      200,
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
