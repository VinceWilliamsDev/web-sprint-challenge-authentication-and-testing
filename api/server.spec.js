const server = require('./server.js')
const request = require('supertest')
const db = require("../database/dbConfig")

describe("test auth endpoints", () => {
    beforeEach(async () => {
        await db("users").truncate()
    })

    describe("test registration", () => {
        it("should add a user to the database", async () => {
            await request(server).post('/api/auth/register').send({
                username: "Bob",
                password: "password"
            })

            const users = await db("users")

            expect(users).toHaveLength(1)
        })
        it("should return the user's id when successfully creating the user", async () => {
            const res = await request(server).post('/api/auth/register').send({
                username: "Bob", 
                password: "password"
            })

            expect(res.body.id).toBe(1)
        })
    })

    describe("test login", () => {
        it("should return a message on successful login", async () => {
            await request(server).post("/api/auth/register").send({
                username: "Bob",
                password: "password"
            })
            const res = await request(server).post("/api/auth/login").send({
                username: "Bob",
                password: "password"
            })

            expect(res.body.message).toBe("you are now logged in")
        })

        it("should respond with an error message when bad credentials are supplied", async () => {
            await request(server).post("/api/auth/register").send({
                username: "Bob",
                password: "password"
            })
            const res = await request(server).post("/api/auth/login").send({
                username: "Bob",
                password: "pass"
            })

            expect(res.body.error).toBe("invalid login attempt")
        })
    })
})

describe("Test jokes endpoint", async () => {
    beforeEach(async () => {
        await db("users").truncate()
    })
    
    it("returns json when a logged in user sends a get request", async () => {
        await request(server).post("/api/auth/register").send({
            username: "Bob",
            password: "password"
        })
        const res = await request(server).post("/api/auth/login").send({
            username: "Bob",
            password: "password"
        })

        const get = await request(server).get("/api/jokes").set('Authorization', res.body.token)

        expect(get.type).toMatch(/json/i)
    })

    it("denies access to users who are not logged in", async () => {
        await request(server).post("/api/auth/register").send({
            username: "Bob",
            password: "password"
        })
        const res = await request(server).post("/api/auth/login").send({
            username: "Bob",
            password: "pass"
        })

        expect(res.body.error).toBe("invalid login attempt")
    })
}) 