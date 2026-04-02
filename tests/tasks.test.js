const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset(); // reset in-memory DB
});

describe("Task API", () => {
  // create task
  describe("POST /tasks", () => {
    it("should create a task with valid data", async () => {
      const res = await request(app)
        .post("/tasks")
        .send({ title: "Test Task", priority: "high" });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Test Task");
    });

    it("should fail if title is missing", async () => {
      const res = await request(app).post("/tasks").send({ priority: "high" });

      expect(res.statusCode).toBe(400);
    });
  });

  // get task
  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      await request(app).post("/tasks").send({ title: "Task 1" });

      const res = await request(app).get("/tasks");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it("should filter tasks by status", async () => {
      await request(app).post("/tasks").send({
        title: "Task 1",
        status: "pending", 
      });

      const res = await request(app).get("/tasks?status=pending"); // ✅ FIX

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it("should paginate tasks", async () => {
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post("/tasks")
          .send({ title: `Task ${i}` });
      }

      const res = await request(app).get("/tasks?page=1&limit=10");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });
  });

  // update task
  describe("PUT /tasks/:id", () => {
    it("should update a task", async () => {
      const create = await request(app)
        .post("/tasks")
        .send({ title: "Old Task" });

      const res = await request(app)
        .put(`/tasks/${create.body.id}`)
        .send({ title: "Updated Task" });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Task");
    });

    it("should return 404 for invalid id", async () => {
      const res = await request(app)
        .put("/tasks/invalid-id")
        .send({ title: "Updated Task" });

      expect(res.statusCode).toBe(404);
    });
  });

  // delete tsak
  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      const create = await request(app)
        .post("/tasks")
        .send({ title: "Delete Task" });

      const res = await request(app).delete(`/tasks/${create.body.id}`);

      expect(res.statusCode).toBe(204);
    });

    it("should return 404 if task not found", async () => {
      const res = await request(app).delete("/tasks/invalid-id");

      expect(res.statusCode).toBe(404);
    });
  });

  // complete task
  describe("PATCH /tasks/:id/complete", () => {
    it("should mark task as complete", async () => {
      const create = await request(app)
        .post("/tasks")
        .send({ title: "Complete Task" });

      const res = await request(app).patch(`/tasks/${create.body.id}/complete`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("completed");
      expect(res.body.completedAt).not.toBeNull();
    });
  });

  //assign task
  describe("PATCH /tasks/:id/assign", () => {
    it("should assign task to user", async () => {
      const create = await request(app)
        .post("/tasks")
        .send({ title: "Assign Task" });

      const res = await request(app)
        .patch(`/tasks/${create.body.id}/assign`)
        .send({ userId: "user-1" });

      expect(res.statusCode).toBe(200);
      expect(res.body.assignedTo).toBe("user-1");
    });

    it("should fail if userId is missing", async () => {
      const create = await request(app)
        .post("/tasks")
        .send({ title: "Assign Task" });

      const res = await request(app)
        .patch(`/tasks/${create.body.id}/assign`)
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it("should return 404 for invalid task id", async () => {
      const res = await request(app)
        .patch("/tasks/invalid-id/assign")
        .send({ userId: "user-1" });

      expect(res.statusCode).toBe(404);
    });
  });
});
