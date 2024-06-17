import { FastifyInstance } from "fastify"
import { knex } from "../config/database"
import { randomUUID } from "crypto"
import { z } from "zod"



export async function users(app: FastifyInstance) {
    app.get("/users", async () => {
        const users = await knex("users").select("*")
        return { "users": users }
    })

    app.post("/user", async (request, reply) => {
        const createUserBodySchema = z.object({
            nm_user: z.string(),
            email: z.string().email('Invalid Email').optional()
        })

        const { nm_user, email } = createUserBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId
        const sevenDays = 60 * 60 * 24 * 7

        if (!sessionId) {
            sessionId = randomUUID()
        }

        reply.cookie("sessionId", sessionId, {
            path: "/",
            maxAge: sevenDays
        })

        const createUser = await knex("users").insert({
            id_user: randomUUID(),
            nm_user: nm_user,
            email,
            session_id: sessionId
        })

        return reply.status(201).send()
    })
}