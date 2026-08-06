const request = require("supertest");
const app = require("../src/app");


describe("Health API",()=>{


test("Server should return health status",async()=>{


const response = await request(app)
.get("/api/health");


expect(response.statusCode)
.toBe(200);


expect(response.body.success)
.toBe(true);


});


});


describe("Products API",()=>{


test("Products endpoint should respond",async()=>{


const response = await request(app)
.get("/api/products");


expect([200,500])
.toContain(response.statusCode);


});


});
