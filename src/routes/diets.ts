import { FastifyInstance } from "fastify"
import { randomUUID } from "node:crypto"
import { knex } from "../config/database"
import { z } from "zod"

export async function dailyDiet(app: FastifyInstance) {
    app.get("/diets", async () => {

    })

    app.get("/diet/:id", () => {

    })

    app.post("/", async (request, reply) => {
        const createDailyDietSchema = z.object({
            title: z.string(),
            description: z.string(),
            sn_diet: z.enum(["S", "N"])
        })

        const { title, description, sn_diet } = createDailyDietSchema.parse(request.body)

        await knex("diets").insert({
            id_diet: randomUUID(),
            title,
            description,
            sn_diet
        })

        return reply.status(201).send()
    })
}