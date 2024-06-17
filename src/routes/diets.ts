import { FastifyInstance } from "fastify"
import { randomUUID } from "node:crypto"
import { knex } from "../config/database"
import { z } from "zod"

export async function dailyDiet(app: FastifyInstance) {
    app.get("/", async (request, reply) => {
        const sessionId = request.cookies.sessionId

        if (!sessionId) {
            return reply.status(401).send({error: "Unauthorized"})
        }

        const diets = await knex("diets")
            .select("diets.*")
            .innerJoin("users", "users.id_user", "diets.id_user")
            .where("users.session_id", sessionId)
        return { diets }
    })


    app.get("/:id", async (request) => {
        const getDietParamSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getDietParamSchema.parse(request.params)
        const diet = await knex("diets").where("id_diet", id).first()

        return { diet }
    })


    app.get("/summary/total", async () => {
        const totalDiets = await knex("diets").count("id_diet", { as: "quantidade"})

        return { totalDiets }
    })


    app.get("/summary/group", async () => {
        const notRealizedDiets = await knex("diets")
            .count("id_diet", { as: "quantidade" })
            .where("is_in_diet", "N")
        
        const realizedDiets = await knex("diets")
            .count("id_diet", { as: "quantidade" })
            .where("is_in_diet", "S")

        return {notRealizedDiets, realizedDiets}
    })


    app.post("/", async (request, reply) => {
        const createDailyDietSchema = z.object({
            id_user: z.string(),
            title: z.string(),
            description: z.string(),
            is_in_diet: z.enum(["S", "N"])
        })

        const { id_user, title, description, is_in_diet } = createDailyDietSchema.parse(request.body)

        await knex("diets").insert({
            id_diet: randomUUID(),
            id_user,
            title,
            description,
            is_in_diet
        })

        return reply.status(201).send()
    })
}