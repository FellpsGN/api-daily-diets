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
            nm_user: z.string()
        })

        const { nm_user } = createUserBodySchema.parse(request.body)

        const createUser = await knex("users").insert({
            id_user: randomUUID(),
            nm_user: nm_user
        })

        return reply.status(201).send()
    })
}