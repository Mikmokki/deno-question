import { superoak } from "../deps.js";
import { app } from "../app.js";

Deno.test({
  name: "GET request to /api/questions/random should return json",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/api/questions/random").expect(200)
      .expect("Content-Type", new RegExp("application/json"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Post request to /api/questions/random with wrong option id should return false",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer").send({
      questionId: 9,
      optionId: 25,
    })
      .expect({ correct: false });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
    name: "Post request to /api/questions/random with correct option id should return true",
    async fn() {
      const testClient = await superoak(app);
      await testClient.post("/api/questions/answer").send({
        questionId: 9,
        optionId: 24,
      })
        .expect({ correct: true });
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  
