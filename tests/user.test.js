const request = require('supertest');
const app = require("../server");

describe("Testing User Api", () => {
    it("Create new user", async () => {
        const response = await request(app).get("/user");
        expect(response.status).toBe(200);
    });
});